



const {Schema, model} = require ('mongoose');



const PurchaseOrderStatusSchema = Schema({


statusOrder: {
    type: Object,
    default: [],
    // emun: [ 'PROCESSING','DELIVERY','PICK_UP_ORDER','COMPLETE','DELETE']
},

order:{
type: Schema.Types.ObjectId,
ref: "PurchaseOrder",
required : true
},



// en este estados solo figura la hora en la cual se hizo el pedido en la app 
    // received:{
    //     type : Object,
    //     default: []
    // },

/* 
  Deberia tener un objeto con "TRUE" al momento q el operario validó el pedido y lo envió a cocina (buen momento para mostrar estado en la app o mandar msj), 
  La hora en la cual lo hizo
  ID de operario (es importante xq puede cambiar el operario en el proceso )  
*/ 
    // processing:{
    //     type : String,
    //     default : ''
    // },
/* 
  Deberia tener un objeto con "TRUE" al momento q el operario lo envió al ciente, 
  La hora en la cual lo hizo
  ID de operario (es importante xq puede cambiar el operario en el proceso )  
  Se puede agregar ID de motoquero
*/

    // delivery : {
    //     type : String,
    //     default : ''
    // },

/* 
  Deberia tener un objeto con "TRUE" al momento q el operario ya tiene listo el pedido para q lo retiren, 
  La hora en la cual lo hizo
  ID de operario (es importante xq puede cambiar el operario en el proceso )  
*/

    // pick_up_order : {
    //     type : String,
    //     default : ''
    // },

    
    /* 
    Deberia tener un objeto con "TRUE" al momento q el pedido ya fue cobrado y entregado, 
    La hora en la cual lo hizo
    ID de operario (es importante xq puede cambiar el operario en el proceso ) o del motoquero, el complete es cuando se cierra todo el ciclo
    (si hay muchos pedidos en "complete" deberia haber una alarma xq puede ser q haya problemas en la cocina, delivery o q los operarios no esten interactuando con el sistema)  
    */

    // complete : {
    // type : String,
    // default : ''
    // },

    /* 
    Deberia tener un objeto con "TRUE" al momento q el pedido ya fue eliminado (puede ser por cancelacion o por otro motivo en el front deberian tener q mandar un mensaje de q fue lo q paso RECORDAR q nada se elimina de las bases de datos se pone el status en false) 
    La hora en la cual lo hizo
    ID de operario (es importante xq puede cambiar el operario en el proceso ) 
    */

    // delete : {
    // type : String,
    // default : ''
    // },

    //este es el operario q comienza la accion despues puede cambiar en los estados del pedido pero van en los estados particuales 
    //  staff:{
    //     type: Schema.Types.ObjectId,
    //     ref: "Staff",
    //     required : true
    //  },

  
    }, { timestamps:true}
    );

    PurchaseOrderStatusSchema.methods.toJSON = function(){
    const {__v,password, ...state} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return state; 
}


module.exports= model('PurchaseOrderStatus', PurchaseOrderStatusSchema);