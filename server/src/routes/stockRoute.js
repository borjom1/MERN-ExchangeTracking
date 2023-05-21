const express = require('express');
const stockController = require('../controllers/stockController');

const route = express.Router();

route
  .get('/all', stockController.getAllSymbols)
  .get('/rate', stockController.getLastRate)
  .get('/time_series', stockController.getTimeSeries)
  .get('/gainers', stockController.getStockGainers)
  .get('/losers', stockController.getStockLosers)
  .post('/recent', stockController.getRecentInfo)
  .post('/subscribe', stockController.subscribe)
  .post('/unsubscribe', stockController.unsubscribe)
  .get('/send', stockController.send);

module.exports = route;