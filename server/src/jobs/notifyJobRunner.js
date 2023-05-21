const schedule = require('node-schedule');
const MailService = require('../services/mailService');

// every day at 12pm
const DAILY_INTERVAL = process.env.DAILY_NOTIFY_CRON_INTERVAL;

// every Sunday at 14pm
const WEEKLY_INTERVAL = process.env.WEEKLY_NOTIFY_CRON_INTERVAL;

const ADDRESS = process.env.MAIL_ACC_ADDRESS;
const PASSWORD = process.env.MAIL_ACC_PASSWORD;

exports.start = () => {

  if (!ADDRESS || !PASSWORD) {
    console.log('[x] Daily Notification Job: gmail account is not defined')
    console.log('[x] Weekly Notification Job: gmail account is not defined')
    return;
  }

  schedule.scheduleJob(DAILY_INTERVAL, () => {
    MailService.notifyDailySubs()
      .then(users => console.log(`[Daily Notification Job]: ${users} notified users.`))
  });

  schedule.scheduleJob(WEEKLY_INTERVAL, () => {
    MailService.notifyWeeklySubs()
      .then(users => console.log(`[Weekly Notification Job]: ${users} notified users.`))
  });

  console.log('[✔] Daily Notification Job')
  console.log('[✔] Weekly Notification Job')
};