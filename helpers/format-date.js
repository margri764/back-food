
   
const customDate = (cDate) => {

   
    let { date, startDate, endDate, searchType } = cDate;


    let start;
    let end;

    switch( searchType ){
        
        /*  */
        case 'DAY':
                     const datFormat = date.split("-")
                     let year = parseInt( datFormat[0] );
                     let month = parseInt( datFormat[1] );
                     let day = parseInt ( datFormat[2] );

                     month = month - 1;
                     start =  new Date( year, month, day  );
                     day = parseInt(day) + 1;
                     end = new Date( year, month, day );
                     
                    return { start, end };

        case 'RANGE':
                    const datFormatS = startDate.split("-")
                    let yearS = parseInt( datFormatS[0] );
                    let monthS = parseInt( datFormatS[1] );
                    let dayS = parseInt ( datFormatS[2] );

                    const datFormatE = endDate.split("-")
                    let yearE = parseInt( datFormatE[0] );
                    let monthE = parseInt( datFormatE[1] );
                    let dayE = parseInt ( datFormatE[2] );

                    monthS = monthS - 1; console.log(monthS);
                    start =  new Date( yearS, monthS, dayS  );
                    
                    dayE = dayE + 1;
                    monthE = monthE - 1; console.log(monthE);
                    end = new Date( yearE, monthE, dayE );
                    
                    return { start, end };

     
         default :  return {start, end };  
      }
    


    // if(!validStatus.includes(status)){

    //     throw new Error (`el estado: ${ status } no es valido ERROR en el front?...`)
    // }

  
}


    module.exports = {
                      customDate
                     }