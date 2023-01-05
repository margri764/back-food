

const checkStatus = (status) => {

    const validStatus = ['EN PROCESO', 'DELIVERY', 'RETIRA EN LOCAL', 'COMPLETADO', 'ELIMINADO' ]

 
    if(!validStatus.includes(status)){

        throw new Error (`el estado: ${ status } no es valido ERROR en el front?...`)
    }

    // switch(status){
        
        
    //     case 'EN PROCESO':
    //                     return (status = 'EN PROCESO');

    //     case 'DELIVERY':
    //                     return (status = 'DELIVERY');

    //     case 'RETIRA EN LOCAL':
    //                     return (status = 'RETIRA EN LOCAL');

    //     case 'COMPLETADO':
    //                     return (status = 'COMPLETADO');

    //     case 'ELIMINADO':
    //                     return (status = 'ELIMINADO');
    
    //      default : '';  
    //   }
    
}


module.exports= { checkStatus } 