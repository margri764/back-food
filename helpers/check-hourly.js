

var moment = require('moment'); 

const checkHour =  (rate, days) => {
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
     beginningTime = moment(beginning, "HH:mm");
     endTime = moment(end, 'HH:mm'); 
   
     const currentDay = moment().day(); 
     const isValidDay = days.includes(currentDay);


     let beginningTime1;
     let beginningTime2;
     let endTime1;
     let endTime2;
     let isValid;
     let isWithinRange1;
     let isWithinRange2;

 // Dividir el rango en dos para abarcar las horas cruzadas
    if (beginningTime > endTime) {
      beginningTime1 = moment(beginning, "HH:mm");
      endTime1 = moment("23:59", "HH:mm");
      beginningTime2 = moment("00:00", "HH:mm");
      endTime2 = moment(endTime, "HH:mm");
      isValid = false;

      // Verificar si la hora actual está dentro del primer rango o si justo son las 00:00 (true si la hora actual (now) está entre beginningTime1 y endTime1, o si es igual a beginningTime2. Si ninguna de las condiciones se cumple, isWithinRange1 será false.)
        isWithinRange1 = now.isBetween(beginningTime1, endTime1) || now.isSame(beginningTime2);

    // Si no esta, tiene que  estar en el segundo
      if(!isWithinRange1){
        isWithinRange2 = now.isBetween(beginningTime2, endTime2) || now.isSame(beginningTime2);;
      }
    //  si se trata de un intervalo normal [10:00 - 14:00]
    } else {
      beginningTime1 = moment(beginning, "HH:mm");
      endTime1 = moment(endTime, "HH:mm");
      isValid = now.isBetween(beginningTime1, endTime1);
      isWithinRange1 = false;
      isWithinRange2 = false;
    }

  return isValidDay && (isWithinRange1 || isWithinRange2 || isValid) ;
}

   
   




module.exports = { checkHour }