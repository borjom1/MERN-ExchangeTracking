const {getRangesFromDays, getRandomTimestamps} = require('../utils/date');
const {changeRate} = require('../utils/random/stockRateGen');
const {genStockVolume} = require('../utils/random/stockVolumeGen');
const {getLastRecord} = require('../utils/query');

const startOfDayHoursUTC = +process.env.EXCHANGE_OPEN_HOURS_UTC;
const endOfDayHoursUTC = +process.env.EXCHANGE_CLOSE_HOURS_UTC;
const lowerBoundMinutes = +process.env.LOWER_BOUND_MINS_UPD;
const upperBoundMinutes = +process.env.UPPER_BOUND_MINS_UPD;

exports.alignRates = async function (Stock, symbols) {
  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);

  if (!Stock || !symbols) return;

  for (const symbol of symbols) {
    // get the latest update for current stock
    const stock = await getLastRecord(Stock, symbol);
    if (!stock) continue;

    const periods = getRangesFromDays(stock.timestamp, now, startOfDayHoursUTC, endOfDayHoursUTC);
    const timestamps = getRandomTimestamps(periods, lowerBoundMinutes, upperBoundMinutes);
    // console.log(`======${Stock.prototype.collection.name.toUpperCase()}======`)
    // nothing to update
    if (!timestamps.length) return;

    const data = genStockSeries(stock, timestamps);
    await Stock.insertMany(data);
  }
};

exports.genStockRates = async (Stock, symbols) => {

  const now = new Date();
  now.setSeconds(0);
  now.setMilliseconds(0);

  for (const symbol of symbols) {
    const stock = await getLastRecord(Stock, symbol);
    const period = {
      start: stock.timestamp,
      end: now
    };

    const timestamps = getRandomTimestamps([period], lowerBoundMinutes, upperBoundMinutes);
    if (!timestamps.length) {
      return;
    }

    const data = genStockSeries(stock, timestamps);
    await Stock.insertMany(data);
  }
  console.log(`generated ${Stock.prototype.collection.name.toUpperCase()} stocks at ${now.toISOString()}`);
};

function genStockSeries(stock, timestamps) {
  const data = [];

  const tmpStock = {
    meta: stock.meta,
    usdRate: stock.usdRate,
    volume: stock.volume
  };

  // go through generated timestamps within interval
  timestamps.forEach(e => {
    tmpStock.usdRate = changeRate(tmpStock.usdRate);
    tmpStock.volume = genStockVolume(tmpStock.volume);
    tmpStock.timestamp = e;
    data.push(Object.assign({}, tmpStock));
  });

  return data;
}