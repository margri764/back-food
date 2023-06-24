
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
     let limitTime = now.toDate();
     limitTime.setHours(22);
     limitTime.setMinutes(0);
     limitTime.setSeconds(0);
     let subtractDay = false;

     if(now.isSameOrAfter(limitTime)){
       beginningTime.subtract(1, "day");
       endTime.subtract(1, "day");
       subtractDay = true;
     }
     // Dividir el rango en dos para abarcar las horas cruzadas
    if (beginningTime > endTime) {
      beginningTime1 = beginningTime;
      endTime1 = endTime.toDate();
      endTime1.setHours("23");
      endTime1.setMinutes("59");
      endTime1.setSeconds("59");
      beginningTime2 = beginningTime.toDate();
      beginningTime2.setHours("00");
      beginningTime2.setMinutes("00");
      beginningTime2.setSeconds("00")
      endTime2 = endTime;
      isValid = false;

      // console.log("beginningTime1: ", beginningTime1);
      // console.log("endTime1: ", endTime1);
      // console.log("beginningTime2: ", beginningTime2);
      // console.log("endTime2: ", endTime2);

     // Verificar si la hora actual est   dentro del primer rango o si justo son las 00:00 (true si la hora actual (now) est   entre beginningTime1 y endTime1, o si es igual a beginningTime2. Si n>        isWithinRange1 = now.isBetween(beginningTime1, endTime1) || now.isSame(beginningTime2);

    // Si no esta, tiene que  estar en el segundo
      if(!isWithinRange1){
        isWithinRange2 = now.isBetween(beginningTime2, endTime2) || now.isSame(beginningTime2);;
      }


    //  si se trata de un intervalo normal [10:00 - 14:00]
     } else {
      beginningTime1 = beginningTime;
      endTime1 = endTime;
      isWithinRange1 = false;
      isWithinRange2 = false;
      isValid = now.isBetween(beginningTime1, endTime1)
    }
 
return isValidDay && (isWithinRange1 || isWithinRange2 || isValid) ;

}


module.exports = { checkHour }