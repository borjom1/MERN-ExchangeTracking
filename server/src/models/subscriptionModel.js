const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  gmail: {
    type: String,
    required: true,
    min: 11
  },
  currencies: {
    type: [String],
    require: true
  },
  stocks: {
    type: [String],
    require: true
  }
}, {
  versionKey: false
});

exports.createSubscriptionModel = collection => {
  return mongoose.model('Subscription', subscriptionSchema, collection);
};