
/* estas ordenes temporales me sirven para mostrarle al cliente q es lo q esta comprando, obvio que pueden ser
varias ordens hasta conformar un pedido, tambien me sirven para lo reloads o cuando dejan una orden inconclusa 
NO TENGO Q OLVIDARME DE INVALIDARLAS SI PASA MAS DE UN DIA SOBRE TODO POR EL TEMA DEL STOCK */ 


const {Schema, model} = require ('mongoose');


const TempPurchaseOrderSchema = Schema({


    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },

    product : [{
    
    idProduct:{
        type: Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true
    }
    }],

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

     status :{
        type : Boolean,
        default: true
     },

    drink : [{
            
            idProduct:{
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: true
            }
    }],

    fries : [{
            
        idProduct:{
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
        quantity: {
            type: Number,
            required: true
        }
}],

     otherExpenses: [
                     {
                
                    idProduct:{
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                    },
                    quantity: {
                        type: Number,
                        required: true
                    }
                    }
    ],
    
    quantity : {
        type: Number,
        deafault : 1
    },

    total:{
        type: Number,
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