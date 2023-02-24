

var moment = require('moment'); 
let valid = [];

const checkHourly = ( rate  ) => {
    if(rate.length != 0){
        rate.forEach(element => { checkHour(element) });
    }
    
    if(valid.indexOf(true) != -1) {
        return true
    }else{
        return false
    }
}

const checkHour =  (rate)=>{

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
    beginningTime = moment( `${beginning}`, 'HH:mm');
    endTime= moment( `${end}`, 'HH:mm')
    
    if(now.isBefore(endTime) && now.isAfter(beginningTime)){ // 
         valid.push(true);
    }else{
         valid.push(false);
        
    }


}

module.exports = {
                 checkHourly
                 }