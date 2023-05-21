const {createStockModel} = require("../models/stockModel");
const {createSubscriptionModel} = require("../models/subscriptionModel");
const {findPercentageBetween} = require("../utils/rate");
const {getAllSymbols, getInfo, getLastRecord, getTimeSeries} = require("../utils/query");

const exchanges = {
  'nasdaq': createStockModel('nasdaq'),
  'nyse': createStockModel('nyse')
};

const subsIntervals = {
  'DAILY': createSubscriptionModel('dayNotify'),
  'WEEKLY': createSubscriptionModel('weekNotify')
};

// stocks data

exports.getStocksInfo = async (ex) => {

  const Stock = exchanges[ex];
  const symbols = await getAllSymbols(Stock);

  // find full name for each symbol
  const data = [];
  for (const symbol of symbols) {
    const result = await getInfo(Stock, symbol);
    data.push(result.meta);
  }

  return data;
};

exports.getLastRate = async (ex, symbol) => {
  if (!ex || !symbol) {
    return null;
  }

  const Stock = exchanges[ex];
  const result = await getLastRecord(Stock, symbol);
  if (!result) {
    return null;
  }
  const {usdRate, volume, timestamp} = result;

  return {symbol, usdRate, volume, timestamp};
};

exports.getTimeSeries = async (ex, symbol, hoursDiff) => {
  const Stock = exchanges[ex];

  // build period relatively to timestamp of the last generated stock
  const {timestamp: to} = await getLastRecord(Stock, symbol);
  const from = new Date(to);
  from.setHours(from.getHours() - hoursDiff);

  const timeSeries = await getTimeSeries(Stock, from, to, {'meta.symbol': symbol});

  const data = {};
  if (timeSeries.length) {
    const start = timeSeries[0];
    const end = timeSeries[timeSeries.length - 1];

    data.meta = {
      fullName: start.meta.fullName,
      symbol: start.meta.symbol,
    };

    // fill interval info
    data.open = start.usdRate;
    const rates = timeSeries.map(e => e.usdRate);

    data.low = Math.min(...rates);
    data.high = Math.max(...rates);
    data.current = end.usdRate;

    data.from = start.timestamp;
    data.to = end.timestamp;
    data.change = findPercentageBetween(data.open, data.current);

    // fill time-series
    data.timeSeries = [];
    timeSeries.forEach(e => {
      data.timeSeries.push({
        timestamp: e.timestamp,
        rate: e.usdRate,
        volume: e.volume
      });
    });
  }

  return data;
};

exports.getStockGainers = async (ex, hoursDiff) => {
  const Stock = exchanges[ex];
  const stockSymbols = await getAllSymbols(Stock);
  const {stocks} = await getIntervalInfo(ex, stockSymbols, hoursDiff);

  return stocks.sort((stock1, stock2) => stock2.change - stock1.change).slice(0, 10);
};

exports.getStockLosers = async (ex, hoursDiff) => {
  const Stock = exchanges[ex];
  const stockSymbols = await getAllSymbols(Stock);
  const {stocks} = await getIntervalInfo(ex, stockSymbols, hoursDiff);

  return stocks.sort((stock1, stock2) => stock1.change - stock2.change).slice(0, 10);
};

exports.getRecentInfo = async (ex, symbols, hoursDiff) => {
  return await getIntervalInfo(ex, symbols, hoursDiff);
};

async function getIntervalInfo(ex, symbols, hoursDiff) {
  const Stock = exchanges[ex];
  const stocks = [];

  let from, to;
  if (symbols.length) {
    ({timestamp: to} = await getLastRecord(Stock, symbols[0]));
    // need to cover all last generated stocks
    to.setHours(to.getHours() + 1);
    from = new Date(to);
    from.setHours(from.getHours() - hoursDiff);
  }

  for (const symbol of symbols) {
    const timeSeries = await getTimeSeries(Stock, from, to, {'meta.symbol': symbol});
    if (!timeSeries) {
      continue;
    }
    const start = timeSeries[0];
    const end = timeSeries[timeSeries.length - 1];

    if (!start) {
      continue;
    }

    const stock = {
      symbol,
      fullName: start.meta.fullName,
      startRate: start.usdRate,
      rate: end.usdRate,
      change: findPercentageBetween(start.usdRate, end.usdRate)
    };
    stocks.push(stock);
  }
  return {stocks, from, to};
}


// subscription

exports.subscribe = async (gmail, stock, intervals) => {
  if (intervals.includes('DAILY')) {
    await trySubscribe(subsIntervals.DAILY, gmail, stock);
  }
  if (intervals.includes('WEEKLY')) {
    await trySubscribe(subsIntervals.WEEKLY, gmail, stock);
  }
};

exports.unsubscribe = async (gmail, stock, intervals) => {
  if (intervals.includes('DAILY')) {
    await tryUnsubscribe(subsIntervals.DAILY, gmail, stock);
  }
  if (intervals.includes('WEEKLY')) {
    await tryUnsubscribe(subsIntervals.WEEKLY, gmail, stock);
  }
};

async function trySubscribe(SubsModel, gmail, newStock) {
  // find subscription in dayNotify collection by gmail
  const dailySubs = await SubsModel.findOne({gmail});
  if (!dailySubs) { // if gmail is not already present in daily subs
    await SubsModel.create({
      gmail,
      currencies: [],
      stocks: [newStock]
    });
  } else if (!dailySubs.stocks.includes(newStock)) { // add stock if not present
    dailySubs.stocks.push(newStock);
    await dailySubs.save();
  }
}

async function tryUnsubscribe(SubsModel, gmail, stock) {
  // find subscription in dayNotify collection by gmail
  const dailySubs = await SubsModel.findOne({gmail});

  if (!dailySubs) {
    throw `Subscription with ${gmail} does not exist`;
  }
  // remove stock from list
  dailySubs.stocks = dailySubs.stocks.filter(e => e !== stock);

  // there are no currencies & stocks subs anymore
  if (!dailySubs.stocks.length && !dailySubs.currencies.length) {
    await SubsModel.deleteOne({gmail}); // delete document
  } else {
    await dailySubs.save();
  }
}