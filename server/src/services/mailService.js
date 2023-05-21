const nodemailer = require('nodemailer');
const {createSubscriptionModel} = require("../models/subscriptionModel");
const StockService = require('./stockService');
const CurrencyService = require('./currencyService');
const {defineInterval} = require('../utils/controller');
const {wrap} = require('../utils/html-letter');
const {getHoursBetween} = require("../utils/date");

const ADDRESS = process.env.MAIL_ACC_ADDRESS;
const PASSWORD = process.env.MAIL_ACC_PASSWORD;

const subsIntervals = {
  'DAILY': createSubscriptionModel('dayNotify'),
  'WEEKLY': createSubscriptionModel('weekNotify')
};

const transporter = nodemailer.createTransport({
  port: 465,
  host: 'smtp.gmail.com',
  auth: {
    user: ADDRESS,
    pass: PASSWORD
  },
  secure: true
});

exports.notifyDailySubs = async () => {
  return await notifyWith();
};

exports.notifyWeeklySubs = async () => {
  return await notifyWith('WEEKLY');
};

function createMail(receiverAddress, subject, html) {
  return {
    from: ADDRESS,
    to: receiverAddress,
    subject,
    html
  };
}

async function notifyWith(interval = 'DAILY') {
  const SubsModel = subsIntervals[interval];
  const cache = new Map();

  let passedItems = 0, notifiedUsers = 0;
  const USERS_PER_QUERY = 100;

  const {before, now} = defineInterval(interval === 'DAILY' ? '1d' : '7d');

  while (true) {
    // get users
    const users = await SubsModel.find().skip(passedItems).limit(USERS_PER_QUERY);

    // there are no users anymore
    if (!users.length) break;

    // prepare info
    for (const user of users) {
      let {currencies, stocks, gmail} = user;

      // process data
      currencies = await retrieveData(null, currencies, cache, before, now);
      stocks = (await retrieveData('nasdaq', stocks, cache, before, now));

      // create & send mail
      const html = wrap(interval, before, now, stocks, currencies);
      const subject = `${interval[0]}${interval.slice(1).toLowerCase()} exchange notification`;
      const mail = createMail(gmail, subject, html);

      transporter.sendMail(mail, error => {
        if (error) {
          console.log(`user ${gmail} was not notified :(`)
        } else {
          // console.log(`user ${gmail} was successfully notified!`);
        }
      });

    }
    notifiedUsers += users.length;
    passedItems += USERS_PER_QUERY;
  }
  return notifiedUsers;
}

async function retrieveData(model, symbols, cache, before, now) {
  const isStock = model && typeof model === 'string';
  const data = [];
  for (const symbol of symbols) {
    // simply take content if this already processed before
    if (cache.has(symbol)) {
      data.push(cache.get(symbol));
      continue;
    }

    // process now
    let lastRate;

    if (isStock) {
      const hoursDiff = getHoursBetween(before, now);
      const {stocks} = await StockService.getRecentInfo('nasdaq', [symbol], hoursDiff);
      lastRate = stocks[0];
    } else {
      const [base, native] = symbol.split('/');
      lastRate = await CurrencyService.getRecentInfo(base, native, before, now);
    }

    cache.set(symbol, lastRate); // push to cache
    data.push(lastRate);
  }
  return data;
}