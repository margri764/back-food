

const checkValue = (value) => {

            let valueInc;
            if(value < 10) {
                   valueInc = `1.0${value}` ;
                   valueInc = parseFloat(valueInc);
                   return valueInc;
             }
        
            if(value > 9 && value < 100) {
                    valueInc = `1.${value}` ;
                    valueInc = parseFloat(valueInc);
                    return valueInc
            }
            
            if(value > 99 && value < 900) {
                     let numberToString = value.toString();
                     let intPart = numberToString.slice(0,1)
                     let decimal = numberToString.slice(1,3)
                     intPart = parseFloat( intPart );
                     intPart= 1 + intPart;
                     valueInc = `${intPart}.${decimal}` ;
                     valueInc = parseFloat(valueInc);
                     return valueInc
            }
            return 1;
    
}


module.exports = {
                  checkValue
                 } 