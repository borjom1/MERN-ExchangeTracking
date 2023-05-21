const mongoose = require('mongoose');
const metaSchema = require('./schema/metaSchema');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  meta: { type: metaSchema, require: true },
  timestamp: { type: Date, require: true },
  usdRate: { type: Number, require: true },
  volume: { type: Number, require: true }
}, {
  versionKey: false
});

exports.createStockModel = collection => {
  return mongoose.model('Stock', stockSchema, collection);
}