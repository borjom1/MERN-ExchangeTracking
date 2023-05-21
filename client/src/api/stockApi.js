import axios from "axios";
import StockIcons from "../assets/icons/stocks/stock_icons";

const HOST = process.env.REACT_APP_HOST_URL;
const ROOT_URL = HOST + '/stocks/';
const icons = StockIcons();

async function getAllStocks() {
  const response = await axios.get(ROOT_URL + 'all');
  const stocks = response.data.data;
  return stocks.map(e => {
    return {
      id: e.symbol,
      title: e.fullName,
      icon: icons[e.symbol] || icons.USD
    }
  });
}

async function getRecentStockInfo(body) {
  const response = await axios.post(ROOT_URL + 'recent', body);
  const stocks = response.data.data;
  console.log(stocks)
  return map(stocks.symbols);
}

async function getStockTimeSeries(exchange, symbol, interval) {
  const requestUrl = ROOT_URL + `time_series?ex=${exchange}&symbol=${symbol}&interval=${interval}`;
  const response = await axios.get(requestUrl);
  return response.data.data;
}

async function getTopStocks(exchange, gainers = true) {
  const requestUrl = ROOT_URL + `${gainers ? 'gainers' : 'losers'}?ex=${exchange}`;
  const response = await axios.get(requestUrl);
  return map(response.data.data);
}

function subscribeOnStock(gmail, stock, intervals) {
  console.log({gmail, stock, intervals})
  axios.post(ROOT_URL + 'subscribe', {gmail, stock, intervals})
    .then(() => alert('You successfully subscribed'))
    .catch(() => alert('Subscription error'));
}

function unsubscribeFromStock(gmail, stock, intervals) {
  axios.post(ROOT_URL + 'unsubscribe', {gmail, stock, intervals})
    .then(() => alert('You successfully unsubscribed'))
    .catch(({response}) => alert(response.data.message));
}

function map(symbols) {
  return symbols.map(e => {
    return {
      id: e.symbol,
      icon: icons[e.symbol] || icons.AMZN,
      name: e.fullName,
      startRate: e.startRate,
      endRate: e.rate,
      change: e.change
    }
  });
}

export {
  getAllStocks, getRecentStockInfo, getStockTimeSeries,
  getTopStocks, subscribeOnStock, unsubscribeFromStock
};