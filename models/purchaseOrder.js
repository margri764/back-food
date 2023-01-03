
/* En teoria deberia ser una sola orden, salvo q un cliente haga varias compras, cierre el pedido lo pague y
   en el mismo dia se acuerde de algo y vuelva a comprar */

const {Schema, model} = require ('mongoose');


const PurchaseOrderSchema = Schema({


    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },

     order: [{
            type: Schema.Types.ObjectId,
            ref: "TempPurchaseOrder",
            required: true
    }],

     staff:{
        type: Schema.Types.ObjectId,
        ref: "Staff",
     },
     
     statusOrder:{
        type : String,
        required: true,
        default: "INGRESADO"

     },
     

    addressDelivery :{
        type: String,
        default: 'RETIRO EN LOCAL'
    },

    total:{
        type: Number,
        default: 0
    },

    }, { timestamps:true}
    );

PurchaseOrderSchema.methods.toJSON = function(){
    const {__v,password, ...order} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return order; 
}


module.exports= model('PurchaseOrder', PurchaseOrderSchema);