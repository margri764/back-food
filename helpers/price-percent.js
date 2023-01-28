



const checkPrice = (price) => {


            let priceInc;
            if(price < 10) {
                   priceInc = `1.0${price}` ;
                   priceInc = parseFloat(priceInc);
                   return priceInc;

             }
        
            if(price >= 10 && price <= 99) {
                    priceInc = `1.${price}` ;
                    priceInc = parseFloat(priceInc);
                    return priceInc

            }
            
            if(price >= 100 && price <= 899) {
                     
                     let numberToString = price.toString();
                     let intPart = numberToString.slice(0,1)
                     let decimal = numberToString.slice(1,3)
                     intPart = parseFloat( intPart );
                     intPart= 1 + intPart;
                     priceInc = `${intPart}.${decimal}` ;
                     priceInc = parseFloat(priceInc);
                     return priceInc
            }

            return 1;



    
}


module.exports=  { checkPrice } 