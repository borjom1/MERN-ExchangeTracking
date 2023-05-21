const {getRandomInt, genSingleInt} = require('./random');

const VOLUME_LIMIT = 1e7;

const genStockVolume = volume => {
  const randPercent = getRandomInt(5, 20);
  const part = Math.round((volume * randPercent) / 100);
  const initVolume = volume;

  // if volume grows or going to drop down below 100
  if (genSingleInt() < 5 || volume - part <= 100) {
    // check if volume is going to exceed volume limit
    volume += volume + part >= VOLUME_LIMIT ? -part : part;
  } else {
    volume -= part;
  }
  // console.log(`initVolume=${initVolume}, %${randPercent}, volume=${volume}`)
  return volume;
};

module.exports = {genStockVolume};