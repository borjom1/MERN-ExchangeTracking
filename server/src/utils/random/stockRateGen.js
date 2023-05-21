const { genSingleInt } = require('./random');

function changeRate(rate) {
  const randomInt = genSingleInt();

  let offset = Math.random();
  offset /= randomInt === 7 ? 0.1 : 2;
  offset = +offset.toFixed(6);

  if (genSingleInt() < 5 || rate - offset <= 0) {
    rate += offset;
  } else {
    rate -= offset;
  }
  return +rate.toFixed(4);
}

module.exports = {changeRate};