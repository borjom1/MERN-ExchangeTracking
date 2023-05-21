
function findPercentage(initPrice, endPrice) {
  const diff = endPrice - initPrice;
  return +((diff * 100) / initPrice).toFixed(2);
}

exports.findPercentageBetween = (initPrice, endPrice) => {
  return findPercentage(initPrice, endPrice);
}

exports.findChangePercentage = (startBase, endBase, startNative, endNative) => {
  /*
    In order to determine the growth dynamics of one (main or native) currency relative to another within a certain
    interval, it is necessary to first determine the individual development of each, then subtract the percentage of
    the other from the percentage of the main currency. It should be tied to the dollar currency
   */
  const baseGrowth = findPercentage(startBase, endBase);
  const nativeGrowth = findPercentage(startNative, endNative);
  return +(nativeGrowth - baseGrowth).toFixed(2);
}