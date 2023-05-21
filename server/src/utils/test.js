const {getRangesFromDays} = require('./date');

// const before = new Date();
// before.setHours(before.getHours() - 12);
// const now = new Date();
//
// console.log(getPeriodsFromDays(before, now, 8, 15))

const before = new Date(2023, 4, 20, 15, 34)
const now = new Date(2023, 4, 21, 11, 24)

console.log('from', before)
console.log('to', now)
console.log(getRangesFromDays(before, now, 8, 15))
