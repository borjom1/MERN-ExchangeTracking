import axios from "axios";
import CurrencyIcons from "../assets/icons/currency/currency_icons";

const HOST = process.env.REACT_APP_HOST_URL;
const ROOT_URL = HOST + '/currencies/';
const icons = CurrencyIcons();


async function getRecentPairInfo(base, symbol, isInversed = false) {
  if (isInversed) {
    [base, symbol] = [symbol, base];
  }

  const url = ROOT_URL + `recent?base=${base}&symbol=${symbol}&interval=1d`;
  const response = await axios.get(url);
  const body = response.data.data;
  const currency = isInversed ? body.base : body.native;

  return {
    id: currency.symbol,
    icon: icons[currency.symbol],
    name: currency.fullName,
    price: body.rate,
    change: body.change
  };
}

async function getRecentPairsInfo(baseSymbol, symbols, isInversed = false) {
  const result = [];
  for (const key in symbols) {
    const symbol = symbols[key];
    const response = await getRecentPairInfo(baseSymbol, symbol, isInversed);
    result.push(response);
  }
  return result;
}

async function getTimeSeries(base, symbol, interval) {
  const url = ROOT_URL + `time_series?base=${base}&symbol=${symbol}&interval=${interval}`;
  const response = await axios.get(url);
  return response.data.data;
}

async function getAllCurrencies() {
  const response = await axios.get(ROOT_URL + 'all');
  const currencies = response.data.data;
  return currencies.map(e => {
    return {
      id: e.symbol,
      title: e.fullName,
      icon: icons[e.symbol] || icons.USD
    }
  });
}

function subscribeOnCurrency(gmail, pair, intervals) {
  console.log({gmail, pair, intervals})
  axios.post(ROOT_URL + 'subscribe', {gmail, pair, intervals})
    .then(() => alert('You successfully subscribed'))
    .catch(() => alert('Subscription error'));
}

function unsubscribeFromCurrency(gmail, pair, intervals) {
  axios.post(ROOT_URL + 'unsubscribe', {gmail, pair, intervals})
    .then(() => alert('You successfully unsubscribed'))
    .catch(({response}) => alert(response.data.message));
}


export {
  getRecentPairInfo, getRecentPairsInfo, getAllCurrencies,
  getTimeSeries, subscribeOnCurrency, unsubscribeFromCurrency
};