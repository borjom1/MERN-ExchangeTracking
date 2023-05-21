const CurrencyService = require('../services/currencyService');
const {defineInterval, messageResponse, checkSubsIntervals} = require('../utils/controller');
const {serverError, checkSymbol} = require('../utils/controller');

const INTERVALS = ['1h', '12h', '1d'];

exports.getAllSymbols = async (req, res) => {
  try {
    const info = await CurrencyService.getCurrenciesInfo();

    return res.status(200).json({
      status: 200,
      data: info
    });

  } catch (error) {
    console.error(error);
    return serverError(res);
  }
};

exports.getLastRate = async (req, res) => {
  const {symbol} = req.query;

  // validate query params
  const errResponse = checkSymbol(res, symbol);
  if (errResponse) return errResponse;

  try {
    const currency = await CurrencyService.getLastRate(symbol);
    if (!currency) {
      return messageResponse(res, 404, 'symbol not found');
    }

    return res.status(200).json({
      status: 200,
      data: currency
    });

  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

exports.getTimeSeries = async (req, res) => {
  const {base, symbol, interval} = req.query;

  // validate query params
  const errResponse = isParamAbsent(res, base, symbol, interval);
  if (errResponse) return errResponse;

  try {
    // define interval
    const {before, now} = defineInterval(interval);
    const {timestamps, data} = await CurrencyService.getTimeSeries(base, symbol, before, now);

    // define main interval params
    if (timestamps.length) {
      data.from = before;
      data.to = now;
      data.open = timestamps[0].rate;
      const rates = timestamps.map(t => t.rate);
      data.low = Math.min(...rates);
      data.high = Math.max(...rates);
      data.timeSeries = timestamps;
    }

    return res.status(200).json({
      status: 200,
      data
    });
  } catch (error) {
    return serverError(res);
  }
};

exports.getRecentInfo = async (req, res) => {
  const {base, symbol, interval} = req.query;

  const errResponse = isParamAbsent(res, base, symbol, interval);
  if (errResponse) return errResponse;

  try {
    const {before, now} = defineInterval(interval);
    const data = await CurrencyService.getRecentInfo(base, symbol, before, now);
    data.interval = interval;

    return res.status(200).json({
      status: 200,
      data
    });
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

function isParamAbsent(res, base, symbol, interval) {
  if (!base || !symbol || !interval) {
    return messageResponse(res, 400, 'base, symbol and interval are required');
  } else if (base === symbol) {
    return messageResponse(res, 400, 'base and symbol must differ');
  } else if (!(INTERVALS.find(e => e === interval))) {
    return messageResponse(res, 400, 'interval is not correct');
  } else {
    return null;
  }
}

exports.subscribe = async (req, res) => {
  const {gmail, pair, intervals} = req.body;

  if (!gmail || !pair) return messageResponse(res, 400, 'gmail or currency pair is not defined');
  let errResponse = checkSubsIntervals(res, intervals);
  if (errResponse) return errResponse;

  try {
    await CurrencyService.subscribe(gmail, pair, intervals);
    return res.status(200).json({status: 200, message: 'successfully subscribed'});
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.unsubscribe = async (req, res) => {
  const {gmail, pair, intervals} = req.body;

  if (!gmail || !pair) return messageResponse(res, 400, 'gmail or currency pair is not defined');
  let errResponse = checkSubsIntervals(res, intervals);
  if (errResponse) return errResponse;

  try {
    await CurrencyService.unsubscribe(gmail, pair, intervals);
    return res.status(200).json({status: 200, message: 'successfully unsubscribed'});
  } catch (error) {
    if (typeof error === 'string')
      return messageResponse(res, 400, error);
    else
      return serverError(res);
  }
};