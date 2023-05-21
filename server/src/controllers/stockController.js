const StockService = require('../services/stockService');
const MailService = require('../services/mailService');
const {
  messageResponse, serverError,
  checkSymbol, checkExchange, checkSubsIntervals
} = require('../utils/controller');
const {hoursFromInterval} = require("../utils/date");

const EXCHANGES = ['nasdaq', 'nyse'];
const INTERVALS = ['1h', '12h', '1d'];


exports.getAllSymbols = async (req, res) => {
  try {
    const data = await StockService.getStocksInfo(EXCHANGES[0]);

    return res.status(200).json({
      status: 200,
      data: data
    });

  } catch (error) {
    console.log(error);
    return serverError(res);
  }
};

exports.getLastRate = async (req, res) => {
  const {ex, symbol} = req.query;

  let errResponse;
  if ((errResponse = checkExchange(res, ex))) return errResponse;
  if ((errResponse = checkSymbol(res, symbol))) return errResponse;

  try {
    const stock = await StockService.getLastRate(ex, symbol);
    if (stock) {
      return res.status(200).json({
        status: 200,
        data: stock
      });
    }

    return messageResponse(res, 404, 'not found');
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.getTimeSeries = async (req, res) => {
  const {ex, symbol, interval} = req.query;

  let errResponse;
  if ((errResponse = checkExchange(res, ex))) return errResponse;
  if ((errResponse = checkSymbol(res, symbol))) return errResponse;
  if (!(INTERVALS.find(e => e === interval))) {
    return messageResponse(res, 400, 'wrong interval');
  }

  try {
    const hoursDiff = hoursFromInterval(interval);
    const data = await StockService.getTimeSeries(ex, symbol, hoursDiff);

    return res.status(200).json({
      status: 200,
      data
    });
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.getRecentInfo = async (req, res) => {
  const symbols = req.body.symbols;
  const exchange = req.body.exchange;

  let errResponse;
  if ((errResponse = checkExchange(res, exchange))) return errResponse;
  if (!symbols) {
    return messageResponse(res, 400, 'body does not contain stock symbols');
  } else if (!exchange) {
    return messageResponse(res, 400, 'body does not contain exchange');
  }

  try {
    const interval = '12h';
    const {stocks} = await StockService.getRecentInfo(exchange, symbols, 12);

    const data = {interval, symbols: stocks};
    return res.status(200).json({status: 200, data});

  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.getStockGainers = async (req, res) => {
  const {ex} = req.query;
  let errResponse;
  if ((errResponse = checkExchange(res, ex))) return errResponse;

  try {
    // get top-10 stocks for last 24h
    const stocks = await StockService.getStockGainers(ex, 24);
    return res.status(200).json({status: 200, data: stocks});
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.getStockLosers = async (req, res) => {
  const {ex} = req.query;
  let errResponse;
  if ((errResponse = checkExchange(res, ex))) return errResponse;

  try {
    // getting loser stocks for last 24 hours
    const stocks = await StockService.getStockLosers(ex, 24);
    return res.status(200).json({status: 200, data: stocks});
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.subscribe = async (req, res) => {
  const {gmail, stock, intervals} = req.body;

  if (!gmail || !stock) return messageResponse(res, 400, 'gmail or stock is not defined');
  let errResponse = checkSubsIntervals(res, intervals);
  if (errResponse) return errResponse;

  try {
    await StockService.subscribe(gmail, stock, intervals);
    return res.status(200).json({status: 200, message: 'successfully subscribed'});
  } catch (error) {
    console.log(error)
    return serverError(res);
  }
};

exports.unsubscribe = async (req, res) => {
  const {gmail, stock, intervals} = req.body;

  if (!gmail || !stock) return messageResponse(res, 400, 'gmail or stock is not defined');
  let errResponse = checkSubsIntervals(res, intervals);
  if (errResponse) return errResponse;

  try {
    await StockService.unsubscribe(gmail, stock, intervals);
    return res.status(200).json({status: 200, message: 'successfully unsubscribed'});
  } catch (error) {
    if (typeof error === 'string')
      return messageResponse(res, 400, error);
    else
      return serverError(res);
  }
};

exports.send = async (req, res) => {
  const {type} = req.query;
  if (type === 'daily') {
    await MailService.notifyDailySubs();
  } else {
    await MailService.notifyWeeklySubs();
  }
  return res.status(200).json({status: 200, message: 'ok'});
};