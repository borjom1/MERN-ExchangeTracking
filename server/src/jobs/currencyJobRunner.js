const schedule = require('node-schedule');
const Currency = require('../models/currencyModel');
const { alignRates, genCurrencyRates } = require('./currencyGen');
const {getAllSymbols} = require('../utils/query');

const interval = process.env.CRON_INTERVAL_UPDATE;

exports.start = async () => {

  // get all currency symbols apart from USD
  const symbols = (await getAllSymbols(Currency)).filter(symbol => symbol !== 'USD');

  // try to align rates & define the time of the next update
  let nextUpd = await alignRates(symbols);

  // this may happen when we require lots of time to align all rates
  // (last updates were a long time ago)
  if (nextUpd < new Date()) {
    nextUpd = await alignRates(symbols);

    // this happens when START_JOB_OFFSET is too low
    if (nextUpd < new Date()) {
      throw new Error(`START_JOB_OFFSET: (${process.env.START_JOB_OFFSET}) should be greater`);
    }
  }

  console.log('[Next currency update]: ' + nextUpd);

  schedule.scheduleJob(nextUpd, () => {
    genCurrencyRates(symbols);

    // start a regular jobs
    schedule.scheduleJob(interval, () => genCurrencyRates(symbols));
  });
};