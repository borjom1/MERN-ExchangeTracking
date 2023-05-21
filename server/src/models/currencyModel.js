const mongoose = require('mongoose');
const metaSchema = require('./schema/metaSchema');

const Schema = mongoose.Schema;

const currencySchema = new Schema({
  meta: { type: metaSchema, require: true },
  timestamp: { type: Date, require: true },
  nativeRate: { type: Number, require: true },
  usdRate: { type: Number, require: true }
}, {
  versionKey: false
});

const currencyModel = mongoose.model('Currency', currencySchema, 'currencies');
module.exports = currencyModel;