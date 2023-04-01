
const cron = require('node-cron');
const mongoose = require('mongoose');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const App = require('../models/appState');
const { dbConnection } = require('../db/config.db');
const { checkHourly } = require('../helpers/check-hourly');


const startCronJob = async () => {
  
  try {
    // seconds (opcional) - minute - hour - day of month - month - day of week
    const task = cron.schedule('7 9 * * *', async () => {
      console.log('Starting cron job...', new Date().toLocaleString());
      await dbConnection();
      const result = await TempPurchaseOrder.deleteMany({ statusOrder: 'INCOMPLETE' });
      console.log(`Deleted ${result.deletedCount} incomplete orders`);

    });
    task.start(); 

  } catch (error) {
    console.error('Error starting cron job:', error);
  }
}

module.exports = startCronJob;





