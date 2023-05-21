const schedule = require('node-schedule');
const {createStockModel} = require('../models/stockModel');
const {alignRates, genStockRates} = require('./stockGen');
const {hoursToWait} = require("../utils/date");
const {getAllSymbols} = require("../utils/query");

const startOfDayHoursUTC = +process.env.EXCHANGE_OPEN_HOURS_UTC;
const endOfDayHoursUTC = +process.env.EXCHANGE_CLOSE_HOURS_UTC;
const interval = process.env.CRON_INTERVAL_STOCKS_UPDATE;

const EXCHANGES = ['nasdaq', 'nyse'];

const exchanges = {
  'nasdaq': createStockModel(EXCHANGES[0]),
  'nyse': createStockModel(EXCHANGES[1])
};

exports.start = async (exchange) => {
  // check if specified exchange exists
  if (!EXCHANGES.find(e => e === exchange)) {
    console.log(`[x] Exchange \"${exchange}\" is not found`);
    return;
  }

  const Stock = exchanges[exchange];

  // get all stock symbols from db
  const symbols = await getAllSymbols(Stock);

  await alignRates(Stock, symbols);
  console.log(`[✔] Instant alignment of ${exchange.toUpperCase()} stocks completed`);

  const jobStartDate = new Date();
  jobStartDate.setMilliseconds(0);

  if (jobStartDate.getUTCHours() < startOfDayHoursUTC) {
    jobStartDate.setUTCHours(startOfDayHoursUTC);
    jobStartDate.setMinutes(0);
  } else if (jobStartDate.getUTCHours() >= endOfDayHoursUTC) {
    jobStartDate.setDate(jobStartDate.getDate() + 1);
    jobStartDate.setUTCHours(startOfDayHoursUTC);
    jobStartDate.setMinutes(0);
  }

  jobStartDate.setSeconds(jobStartDate.getSeconds() + 10);
  console.log(`[Stock Job | ${exchange.toUpperCase()}]: is starting on ${jobStartDate}`)

  // setting up a jobs
  schedule.scheduleJob(jobStartDate, job);

  function job() {
    genStockRates(Stock, symbols);

    // regular jobs
    const regularJob = schedule.scheduleJob(interval, () => {
      genStockRates(Stock, symbols);
      const now = new Date();
      if (now.getUTCHours() >= endOfDayHoursUTC) {
        regularJob.cancel();
        console.log(`[Stock Job | ${exchange.toUpperCase()}]: completed`)

        // define a start time of new regular job
        const newStartTime = new Date();
        newStartTime.setSeconds(0);
        newStartTime.setMinutes(0);

        // define what amount of time we should wait for the next regular job
        hoursToWait(newStartTime, startOfDayHoursUTC);

        console.log(`[Stock Job | ${exchange.toUpperCase()}]: is starting on ${newStartTime}`)
        schedule.scheduleJob(newStartTime, job);
      }
    });

  }

};