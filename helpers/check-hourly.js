

var moment = require('moment'); 


const checkHourly = ( noonHour, nightHour, days  ) => {


    let now = moment().locale('es-AR').format('HH:mm');
    now = moment(`${now}`, 'HH:mm')
    let valid;
    let tempNoonHour;

    tempNoonHour = noonHour[0];
    valid = noonHour[1];
    console.log(tempNoonHour, valid);
    tempNoonHour.split('-')
    let noonBeginningTime = tempNoonHour[0];
    let noonEndTime = tempNoonHour[1];

    const beginningTimeNoon = moment( `${noonBeginningTime}`, 'HH:mm');
    const endTimeNoon= moment( `${noonEndTime}`, 'HH:mm');

    let beginningTimeNigth;
    let endTimeNigth;
 console.log(nightHour);
    if(nightHour != undefined){
        const tempNightHour = nightHour.split('-')
        let nigthBeginningTime = tempNightHour[0];
        let nigthEndTime = tempNightHour[1];
        beginningTimeNigth = moment( `${nigthBeginningTime}`, 'HH:mm');
        endTimeNigth= moment( `${nigthEndTime}`, 'HH:mm');
     }

    if(now.isBefore(endTimeNoon) && now.isAfter(beginningTimeNoon) && valid  || now.isBefore(endTimeNigth) && now.isAfter(beginningTimeNigth) && valid ){ // 
        return true;
    }else{
        return false;
    }

}

module.exports = {
                 checkHourly
                 }