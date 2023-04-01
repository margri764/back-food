

var moment = require('moment'); 
let valid = [];

const checkHourly = ( rate  ) => {
    if(rate.length != 0){
        rate.forEach(element => { checkHour(element) });
    }else{
        return true; // si no hay horario en el back siempre tiene q estar disponible
    }
    
    if(valid.indexOf(true) != -1) {
        return true
    }else{
        return false
    }
}

const checkHour =  (rate, days)=>{

    console.log(days);

    let now = moment().locale('es-AR').format('HH:mm');
    now = moment(`${now}`, 'HH:mm')
    let beginning;
    let end;
    let beginningTime;
    let endTime;
    let tempRate;

    tempRate = rate.split('-')
    beginning = tempRate[0];
    end = tempRate[1];
    
    console.log("days: ",days);

    beginningTime = moment( `${beginning}`, 'HH:mm');
    endTime= moment( `${end}`, 'HH:mm')

    const currentDay = moment().day();
    const isValidDay = days.includes(currentDay);
    
    if(isValidDay && now.isBefore(endTime) && now.isAfter(beginningTime)){ // 
         valid.push(true);
    }else{
         valid.push(false);
        
    }


}

module.exports = {
                 checkHourly
                 }