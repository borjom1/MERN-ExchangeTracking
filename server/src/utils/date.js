const { getRandomInt } = require('./random/random');

function getDiffInMinutes (before, after) {
  const diffMillis = Math.abs(before - after);
  return Math.floor(diffMillis / 60000);
}

// returns array of dates with specified interval from [date] -> to [date]
exports.getTimestamps = (from, to, intervalInMinutes) => {
  if (from > to) {
    return [];
  }
  let minutes = getDiffInMinutes(from, to);
  const timestamps = [];
  const tmpDate = new Date(from);
  while (minutes >= intervalInMinutes) {
    minutes -= intervalInMinutes;
    tmpDate.setMinutes(tmpDate.getMinutes() + intervalInMinutes);
    timestamps.push(new Date(tmpDate));
  }
  return timestamps;
};


function splitIntoDays(start, end) {
  if (start > end) {
    return [];
  }
  const data = [];

  while (true) {
    const currentEndOfDay = new Date(start);
    currentEndOfDay.setUTCHours(23);
    currentEndOfDay.setMinutes(59);

    if (currentEndOfDay > end) {
      currentEndOfDay.setUTCHours(end.getUTCHours());
      currentEndOfDay.setMinutes(end.getMinutes());
      data.push({
        start: new Date(start),
        end: currentEndOfDay
      });
      break;
    }
    data.push({
      start: new Date(start),
      end: currentEndOfDay
    });
    start = new Date(currentEndOfDay);
    start.setMinutes(60);
  }
  return data;
}

exports.getRangesFromDays = (startDate, endDate,
                             startOfDayHoursUTC,
                             endOfDayHoursUTC) => {

  const days = splitIntoDays(startDate, endDate);
  if (!days || startOfDayHoursUTC > endOfDayHoursUTC) {
    return [];
  }

  const ranges = [];
  for (const {start, end} of days) {

    if (start.getUTCHours() > endOfDayHoursUTC ||
        end.getUTCHours() < startOfDayHoursUTC) {
      continue;
    }

    const startOfPeriod = new Date(Date.UTC(
      start.getUTCFullYear(), start.getUTCMonth(),
      start.getUTCDate(), startOfDayHoursUTC
    ));

    const endOfPeriod = new Date(Date.UTC(
      end.getUTCFullYear(), end.getUTCMonth(),
      end.getUTCDate(), endOfDayHoursUTC
    ));

    // if we have a whole day
    if (start.getUTCHours() === 0 && end.getUTCHours() === 23) {

      ranges.push({ start: startOfPeriod, end: endOfPeriod });

    } else if (start.getUTCHours() !== 0 &&
               start.getUTCHours() <= endOfDayHoursUTC) {

      if (startDate.getUTCHours() !== endOfPeriod.getUTCHours())
        ranges.push({ start: startDate, end: endOfPeriod });

    } else {
      const final = endDate.getUTCHours() >= endOfDayHoursUTC ?
        endOfPeriod : new Date(endDate);

      ranges.push({ start: startOfPeriod, end: final });
    }
  }
  return ranges;
};

exports.getRandomTimestamps = (periods, lowerBoundMinutes, upperBoundMinutes) => {
  const timestamps = [];
  periods.forEach(period => {
    const start = period.start;
    const end = period.end;

    let minutesOffset = getRandomInt(lowerBoundMinutes, upperBoundMinutes);
    start.setMinutes(start.getMinutes() + minutesOffset);
    while (start < end) {
      timestamps.push(new Date(start));
      minutesOffset = getRandomInt(lowerBoundMinutes, upperBoundMinutes);
      start.setMinutes(start.getMinutes() + minutesOffset);
    }
  });
  return timestamps;
};

exports.hoursToWait = (date, hoursUTC) => {
  const hoursOffset = 24 - date.getUTCHours() + hoursUTC;
  date.setUTCHours(date.getUTCHours() + hoursOffset);
  return date;
}

exports.hoursFromInterval = interval => {
  switch (interval) {
    case '1h':
      return 1;
    case '12h':
      return 12;
    case '1d':
      return 24;
    case '7d':
      return 7 * 24;
  }
};

exports.getHoursBetween = (before, now) => {
  const diffInMinutes = Math.round((now.getTime() - before.getTime()) / 60000);
  return Math.floor(diffInMinutes / 60);
};