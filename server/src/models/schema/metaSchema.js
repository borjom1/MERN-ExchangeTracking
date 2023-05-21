const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const metaSchema = new Schema({
  fullName: {type: String, require: true},
  symbol: {type: String, require: true}
});

module.exports = metaSchema;