
const defineInterval = interval => {
  const now = new Date();
  const before = new Date();
  switch (interval) {
    case '1h':
      before.setHours(before.getHours() - 1);
      break;
    case '12h':
      before.setHours(before.getHours() - 12);
      break;
    case '1d':
      before.setDate(before.getDate() - 1);
      break;
    case '7d':
      before.setDate(before.getDate() - 7);
      break;
  }
  return {before, now};
};

const messageResponse = (res, status, msg) => {
  return res.status(status).json({
    message: msg
  });
}


const checkSymbol = (res, symbol) => {
  return !symbol ?
    messageResponse(res, 404, 'symbol not defined')
    : null;
};

const checkExchange = (res, ex) => {
  if (ex && (ex === 'nasdaq' || ex === 'nyse')) {
    return null;
  }
  return messageResponse(res, 400, 'exchange is not correct');
};

const serverError = (res, msg = 'server error') => messageResponse(res, 500, msg);

const checkSubsIntervals = (res, intervals) => {
  if (!intervals.includes('DAILY') && !intervals.includes('WEEKLY')) {
    return messageResponse(res, 400, 'intervals is not correct');
  }
}

module.exports = {
  defineInterval, messageResponse, serverError,
  checkSymbol, checkExchange, checkSubsIntervals
};