

var moment = require('moment'); 


const checkHourly = ( noonHour, nightHour, days  ) => {


    let now = moment().locale('es-AR').format('HH:mm');
    now = moment(`${now}`, 'HH:mm')

    const tempNoonHour = noonHour.split('-')
    let noonBeginningTime = tempNoonHour[0];
    let noonEndTime = tempNoonHour[1];

    const beginningTimeNoon = moment( `${noonBeginningTime}`, 'HH:mm');
    const endTimeNoon= moment( `${noonEndTime}`, 'HH:mm');

    const tempNightHour = nightHour.split('-')
    let nigthBeginningTime = tempNightHour[0];
    let nigthEndTime = tempNightHour[1];

    const beginningTimeNigth = moment( `${nigthBeginningTime}`, 'HH:mm');
    const endTimeNigth= moment( `${nigthEndTime}`, 'HH:mm');


    if(now.isBefore(endTimeNoon) && now.isAfter(beginningTimeNoon)  || now.isBefore(endTimeNigth) && now.isAfter(beginningTimeNigth) ){ // 
        return true;
    }else{
        return false;
    }

}

module.exports = {
                 checkHourly
                 }