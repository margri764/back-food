
const cron = require('node-cron');
const mongoose = require('mongoose');
const TempPurchaseOrder = require('../models/tempPurchaseOrder');
const { dbConnection } = require('../db/config.db');


const startCronJob = async () => {
  
  try {
    
    console.log('Starting cron job...');
    const task = cron.schedule('*/1 * * * *', async () => {
      console.log(new Date().toLocaleString());
    });
    task.start(); 

  } catch (error) {
    console.error('Error starting cron job:', error);
  }
};

module.exports = startCronJob;


// const startCronJob = async () => {
//   try {
    
//     const task = cron.schedule('1,2,3 * * * * *', async () => {
//         console.log(new Date().toLocaleString());
//       // console.log('Tarea de eliminación iniciada...');
//       // try {
//       //   await dbConnection();
//       //   console.log('Conexión a la base de datos establecida.');
//       //   const result = await TempPurchaseOrder.deleteMany({ statusOrder: 'INCOMPLETE' });
//       //   console.log(`Deleted ${result.deletedCount} incomplete orders`);
//       // } catch (error) {
//       //   console.error('Error deleting incomplete orders:', error);
//       // } finally {
//       //   mongoose.disconnect();
//       //   console.log('Conexión a la base de datos cerrada.');
//       // }
//     });

//     task.start();
//     console.log('Tarea de eliminación programada.');
//   } catch (error) {
//     console.error('Error al establecer la conexión a la base de datos:', error);
//     mongoose.disconnect();
//   }
// };

