const Currency = require('../models/currencyModel');
const {createSubscriptionModel} = require("../models/subscriptionModel");
const {getAllSymbols, getInfo, getLastRecord, getTimeSeries} = require('../utils/query');
const {findPercentageBetween, findChangePercentage} = require("../utils/rate");

const subsIntervals = {
  'DAILY': createSubscriptionModel('dayNotify'),
  'WEEKLY': createSubscriptionModel('weekNotify')
};

exports.getCurrenciesInfo = async () => {
  const symbols = await getAllSymbols(Currency);
  const data = [];

  // find full name for each symbol
  for (const symbol of symbols) {
    const result = await getInfo(Currency, symbol);
    data.push(result.meta);
  }
  return data;
};

exports.getLastRate = async (symbol) => {
  const currency = await getLastRecord(Currency, symbol);
  if (!currency) {
    return null;
  }
  const {usdRate, nativeRate, timestamp} = currency;
  return {symbol, usdRate, nativeRate, timestamp};
};

exports.getTimeSeries = async (base, symbol, before, now) => {
  // get interval data from db
  const baseTimeSeries = await getCurrencyTS(base, before, now);
  const nativeTimeSeries = await getCurrencyTS(symbol, before, now);

  // fill up response data
  const data = {};
  const timestamps = [];

  // conversion
  if (base === 'USD' && nativeTimeSeries.length) {

    data.base = {fullName: 'US Dollar', symbol: base};
    data.native = {
      fullName: nativeTimeSeries[0].meta.fullName,
      symbol: nativeTimeSeries[0].meta.symbol
    };

    nativeTimeSeries.forEach(({timestamp, nativeRate}) =>
      timestamps.push({timestamp, rate: nativeRate})
    );

    const firstNativeTS = nativeTimeSeries[0];
    const lastNativeTS = nativeTimeSeries[nativeTimeSeries.length - 1];
    data.change = findPercentageBetween(lastNativeTS.usdRate, firstNativeTS.usdRate);

  } else if (symbol === 'USD' && baseTimeSeries.length) {

    data.base = {
      fullName: baseTimeSeries[0].meta.fullName,
      symbol: baseTimeSeries[0].meta.symbol
    };
    data.native = {fullName: 'US Dollar', symbol};

    baseTimeSeries.forEach(({timestamp, usdRate}) =>
      timestamps.push({timestamp, rate: usdRate})
    );

    const firstBaseTS = baseTimeSeries[0];
    const lastBaseTS = baseTimeSeries[baseTimeSeries.length - 1];
    data.change = -findPercentageBetween(lastBaseTS.usdRate, firstBaseTS.usdRate);

  } else if (baseTimeSeries.length && nativeTimeSeries.length) { // when both currencies are not USD
    data.base = {
      fullName: baseTimeSeries[0].meta.fullName,
      symbol: baseTimeSeries[0].meta.symbol
    };

    data.native = {
      fullName: nativeTimeSeries[0].meta.fullName,
      symbol: nativeTimeSeries[0].meta.symbol
    };

    for (let i = 0; i < baseTimeSeries.length; i++) {
      const baseCurrency = baseTimeSeries[i];
      const nativeCurrency = nativeTimeSeries[i];
      const rate = +(baseCurrency.usdRate * nativeCurrency.nativeRate).toFixed(5);
      timestamps.push({timestamp: baseCurrency.timestamp, rate});
    }
    // currency-change definition is slightly different because of double conversion
    const baseUsdStartRate = baseTimeSeries[0].usdRate;
    const baseUsdEndRate = baseTimeSeries[baseTimeSeries.length - 1].usdRate;
    const nativeUsdStartRate = nativeTimeSeries[0].usdRate;
    const nativeUsdEndRate = nativeTimeSeries[nativeTimeSeries.length - 1].usdRate;

    data.change = findChangePercentage(
      baseUsdStartRate, baseUsdEndRate,
      nativeUsdStartRate, nativeUsdEndRate
    );
  }

  return {data, timestamps};
};

exports.getRecentInfo = async (base, symbol, before, now) => {
  const data = {};

  if (base === 'USD') {
    const timeSeries = await getCurrencyTS(symbol, before, now);
    const firstTS = timeSeries[0];
    const lastTS = timeSeries[timeSeries.length - 1];

    data.base = {fullName: 'US Dollar', symbol: base};
    data.native = {
      fullName: firstTS.meta.fullName,
      symbol: firstTS.meta.symbol
    };
    data.rate = lastTS.nativeRate;
    data.change = findPercentageBetween(firstTS.nativeRate, data.rate);

  } else if (symbol === 'USD') {
    const timeSeries = await getCurrencyTS(base, before, now);
    const firstTS = timeSeries[0];
    const lastTS = timeSeries[timeSeries.length - 1];

    data.base = {
      fullName: firstTS.meta.fullName,
      symbol: firstTS.meta.symbol
    };
    data.native = {fullName: 'US Dollar', symbol};
    data.rate = lastTS.usdRate;
    data.change = findPercentageBetween(firstTS.usdRate, data.rate);

  } else {

    const baseTimeSeries = await getCurrencyTS(base, before, now);
    const nativeTimeSeries = await getCurrencyTS(symbol, before, now);
    const firstBaseTS = baseTimeSeries[0], lastBaseTS = baseTimeSeries[baseTimeSeries.length - 1];
    const firstNativeTS = nativeTimeSeries[0], lastNativeTS = nativeTimeSeries[nativeTimeSeries.length - 1];

    data.base = {
      fullName: firstBaseTS.meta.fullName,
      symbol: firstBaseTS.meta.symbol
    };
    data.native = {
      fullName: firstNativeTS.meta.fullName,
      symbol: firstNativeTS.meta.symbol
    };
    data.rate = +(lastBaseTS.usdRate * lastNativeTS.nativeRate).toFixed(5);
    data.change = findChangePercentage(
      firstBaseTS.usdRate, lastBaseTS.usdRate,
      firstNativeTS.usdRate, lastNativeTS.usdRate
    );
  }

  return data;
};

async function getCurrencyTS(symbol, before, now) {
  return await getTimeSeries(Currency, before, now, {'meta.symbol': symbol});
}


// subscription

exports.subscribe = async (gmail, currencyPair, intervals) => {
  if (intervals.includes('DAILY')) {
    await trySubscribe(subsIntervals.DAILY, gmail, currencyPair);
  }
  if (intervals.includes('WEEKLY')) {
    await trySubscribe(subsIntervals.WEEKLY, gmail, currencyPair);
  }
};

exports.unsubscribe = async (gmail, currencyPair, intervals) => {
  if (intervals.includes('DAILY')) {
    await tryUnsubscribe(subsIntervals.DAILY, gmail, currencyPair);
  }
  if (intervals.includes('WEEKLY')) {
    await tryUnsubscribe(subsIntervals.WEEKLY, gmail, currencyPair);
  }
};

async function trySubscribe(SubsModel, gmail, newCurrencyPair) {
  // find subscription in dayNotify collection by gmail
  const dailySubs = await SubsModel.findOne({gmail});
  if (!dailySubs) { // if gmail is not already present in daily subs
    await SubsModel.create({
      gmail,
      currencies: [newCurrencyPair],
      stocks: []
    });
  } else if (!dailySubs.currencies.includes(newCurrencyPair)) { // add stock if not present
    dailySubs.currencies.push(newCurrencyPair);
    await dailySubs.save();
  }
}

async function tryUnsubscribe(SubsModel, gmail, currencyPair) {
  // find subscription in dayNotify collection by gmail
  const dailySubs = await SubsModel.findOne({gmail});

  if (!dailySubs) {
    throw `Subscription with ${gmail} does not exist`;
  }
  // remove stock from list
  dailySubs.currencies = dailySubs.currencies.filter(e => e !== currencyPair);

  // there are no currencies & stocks subs anymore
  if (!dailySubs.stocks.length && !dailySubs.currencies.length) {
    await SubsModel.deleteOne({gmail}); // delete document
  } else {
    await dailySubs.save();
  }
}