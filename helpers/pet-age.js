
const moment = require('moment');  



const petAge = async ( birthDate ) => {

    const actualDay = moment();
    console.log("actual day: ",actualDay);
    // birthDate= moment(this._artistservice.getArtist.birthDate);
   
    const petAge = actualDay.diff(birthDate, 'days');

    console.log("petAge: ",petAge)
    return petAge;
}

module.exports={ 
  petAge
}