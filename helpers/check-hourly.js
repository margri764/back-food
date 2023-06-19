

var moment = require('moment'); 
let valid = [];

// const checkHourly = ( rate  ) => {
//     if(rate.length != 0){
//         rate.forEach(element => { checkHour(element) });
//     }else{
//         return true; // si no hay horario en el back siempre tiene q estar disponible
//     }
    
//     if(valid.indexOf(true) != -1) {
//         return true
//     }else{
//         return false
//     }
// }

const checkHour = (rate, days) => {
     const now = moment();
     now.subtract(3, "hours")

     let beginning;
     let end;
     let beginningTime;
     let endTime;
     let tempRate;
   
     tempRate = rate.split('-');
     beginning = tempRate[0];
     end = tempRate[1];
   
     beginningTime = moment(`${beginning}`, 'HH:mm'); 
     endTime = moment(`${end}`, 'HH:mm'); 
   
     const currentDay = moment().day(); // Obtener el día actual (0 para domingo, 1 para lunes, etc.)
     const isValidDay = days.includes(currentDay);
   
     if (isValidDay && now.isBefore(endTime) && now.isAfter(beginningTime)) {
       return true;
     } else {
       return false;
     }
   }
   



module.exports = { checkHour }