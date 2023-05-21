const Currency = require("../models/currencyModel");
const { getTimestamps } = require("../utils/date");
const { getLastRecord } = require("../utils/query");
const { changeRate } = require("../utils/random/currencyRateGen");

const startOffset = +process.env.START_JOB_OFFSET;
const interval = +process.env.INTERVAL_UPDATE;

exports.alignRates = async function (symbols) {
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);

  let lastUpd = 0; // the latest update (date) for all currencies

  for (const symbol of symbols) {
    // get last update for current currency
    const currency = await getLastRecord(Currency, symbol);
    if (!currency) continue;

    const timestamps = getTimestamps(currency.timestamp, now, interval);

    // last update for this currency was a long time ago
    if (timestamps.length) {
      const tmpCurrency = {
        meta: currency.meta,
        usdRate: currency.usdRate,
        nativeRate: currency.nativeRate
      };

      lastUpd = Math.max(lastUpd, timestamps[timestamps.length - 1]);

      const data = [];

      timestamps.forEach(e => {
        const rates = changeRate(tmpCurrency.nativeRate, tmpCurrency.usdRate);
        tmpCurrency.usdRate = rates.usdRate;
        tmpCurrency.nativeRate = rates.nativeRate;
        tmpCurrency.timestamp = e;
        data.push(Object.assign({}, tmpCurrency));
      });

      await Currency.insertMany(data);
    } else {
      lastUpd = currency.timestamp;
    }
  }
  console.log('[✔] Instant alignment of currencies completed');
  const nextUpd = new Date(lastUpd);
  nextUpd.setMinutes(nextUpd.getMinutes() + startOffset); // define time of the next update
  return nextUpd;
}

exports.genCurrencyRates = async (symbols) => {
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);

  const data = [];
  for (const symbol of symbols) {
    // get last update
    const currency = await getLastRecord(Currency, symbol);
    if (!currency) continue;

    const newRates = changeRate(currency.nativeRate, currency.usdRate);
    currency.timestamp = now;
    data.push(Object.assign(currency, newRates));
  }
  await Currency.insertMany(data);
  console.log(`generated currencies at ${now.toISOString()}`);
}