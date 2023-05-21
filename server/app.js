const express = require('express');
const mongoose = require('mongoose').default;
const morgan = require('morgan');
require('dotenv').config();

const EXCHANGES = ['nasdaq', 'nyse'];

const currencyJob = require('./src/jobs/currencyJobRunner');
const stockJob = require('./src/jobs/stockJobRunner');
const notifyJob = require('./src/jobs/notifyJobRunner');
const currencyRouter = require('./src/routes/currencyRoute');
const stockRouter = require('./src/routes/stockRoute');

const app = express();

// setup middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
  next();
});
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/currencies', currencyRouter);
app.use('/api/v1/stocks', stockRouter);

// connect to db & start server
const port = process.env.PORT;
const dbUri = process.env.DB_URI;

mongoose.connect(dbUri).then(() => {
  console.log('[✔] Connected to MongoDB');
  app.listen(port, () => console.log(`[✔] Server started on port ${port}\n`));
  // jobs
  currencyJob.start().then(() => console.log('[✔] Currency Gen jobs\n'));
  stockJob.start(EXCHANGES[0]).then(() => console.log(`[✔] Stock Gen job | ${EXCHANGES[0].toUpperCase()} \n`))
  stockJob.start(EXCHANGES[1]).then(() => console.log(`[✔] Stock Gen job | ${EXCHANGES[1].toUpperCase()} \n`))
  notifyJob.start();
}).catch((error) => console.log(error));