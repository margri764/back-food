



const {Schema, model} = require ('mongoose');


const TempPurchaseOrderSchema = Schema({


    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },
 
     product:{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
        }
     ,

    //  esto está para saber quien es el miembro del staff que hizo algun update en los estados
     staff:{
        type: Schema.Types.ObjectId,
        ref: "Staff",
     },
     
     statusOrder:{
        type : String,
        required: true,
        default: "INCOMPLETE"

     },
     
    
     otherExpenses:  {
        type: Array,
        default:[]
    },

    addressDelivery :{
        type: String,
        default: 'RETIRO EN LOCAL'
    },


    total:{
        type: String,
        required : true
    },

    }, { timestamps:true}
    );

TempPurchaseOrderSchema.methods.toJSON = function(){
    const {__v,password, ...order} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return order; 
}


module.exports= model('TempPurchaseOrder', TempPurchaseOrderSchema);