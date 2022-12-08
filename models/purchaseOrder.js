

const {Schema, model} = require ('mongoose');


const PurchaseOrderSchema = Schema({


    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },

 
     product:{
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: true
     },
     
     statesOrderPurchase:{
        type: Schema.Types.ObjectId,
        ref: "statesOrderPurchase",
        // required: true
     },
    
     otherExpenses:  {
        type: Object,
        default:[]
    },

    addressDelivery :{
        type: String,
        default: 'RETIRO EN LOCAL'
    },


    price:{
        type: String,
        default: ''
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