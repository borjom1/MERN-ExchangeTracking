
async function getAllSymbols(model) {
  if (!model) {
    return [];
  }

  return await model.find()
    .sort({'meta.symbol': 1})
    .distinct('meta.symbol');
}

async function getInfo(model, symbol) {
  if (!model || !symbol) {
    return null;
  }
  return await model.findOne({'meta.symbol': symbol}, {'meta._id': 0});
}

async function getLastRecord(model, symbol) {
  if (!model || !symbol) {
    return null;
  }

  const items = await model.find({
    'meta.symbol': symbol
  }, {
    _id: 0,
  }).sort({
    timestamp: -1
  }).limit(1);

  return items[0];
}

async function getTimeSeries(model, before, now, filter) {
  return await model.find({
    ...filter,
    timestamp: {
      $lte: now,
      $gte: before
    }
  }, {
    _id: 0,
    'meta._id': 0
  }).sort({
    timestamp: 1
  });
}


module.exports = {getAllSymbols, getInfo, getLastRecord, getTimeSeries};