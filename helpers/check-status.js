

const checkStatus = (status) => {

    switch(status){
        
        
        case 'PROCCESING':
              return (status =  'PROCCESING');

        case 'DELIVERY':
            return   (status =  'DELIVERY');

        case 'PICK_UP_ORDER':
            return   (status =  'PICK_UP_ORDER');

        case 'COMPLETE':
            return   (status =  'COMPLETE');

        case 'DELETE':
            return   (status =  'DELETE');
    
         default : '';  
      }
    
}


module.exports= checkStatus 