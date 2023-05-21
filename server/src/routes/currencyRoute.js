const express = require('express');
const currencyController = require('../controllers/currencyController');

const route = express.Router();

route
  .get('/all', currencyController.getAllSymbols)
  .get('/rate', currencyController.getLastRate)
  .get('/time_series', currencyController.getTimeSeries)
  .get('/recent', currencyController.getRecentInfo)
  .post('/subscribe', currencyController.subscribe)
  .post('/unsubscribe', currencyController.unsubscribe);

module.exports = route;