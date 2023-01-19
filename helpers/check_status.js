
const checkStatus = (status) => {

    

    const validStatus = ['SIN PROCESAR','EN PROCESO', 'ORDEN LISTA', 'ENTREGA DELIVERY', 'ENTREGA EN LOCAL', 'COMPLETADO','ELIMINADO' ]

     console.log(status);
    if(!validStatus.includes(status)){

        throw new Error (`el estado: ${ status } no es valido ERROR en el front?...`)
    }

    return true
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


module.exports=  checkStatus 