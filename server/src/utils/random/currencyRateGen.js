const { genSingleInt } = require('./random');

function genOffset () {
  const randomInt = genSingleInt();
  let offset = Math.random();
  if (randomInt in [2, 4, 6]) {
    offset /= 10000;
  } else if (randomInt in [0, 1, 3, 5]) {
    return 0;
  } else {
    offset /= 100000;
  }
  return +offset.toFixed(8);
}

exports.changeRate = (nativeRate, usdRate) => {
  const ratio = +(nativeRate / usdRate).toFixed(6);

  let offset = genOffset();
  if (offset === 0) {
    return { nativeRate, usdRate };
  }
  offset /= nativeRate > 50 ? 4 : 2;

  const isGrowing = genSingleInt() < 5;

  usdRate += isGrowing ? offset : -offset;
  const tmpNativeRate = ratio * usdRate;
  const diff = Math.abs(nativeRate - tmpNativeRate);

  nativeRate += isGrowing ? -diff : diff;

  return {
    nativeRate: +nativeRate.toFixed(6),
    usdRate: +usdRate.toFixed(7)
  }
};