
   const {Schema, model} = require ('mongoose');


   const RevimackSchema = Schema({
   
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
       
       finished : {
                type : Boolean,
                deafult : false
       },
   
        statusOrder: {
           type: Array,
           default: [],
       },
   
       addressDelivery :{
           type: String,
           default: 'RETIRO EN LOCAL'
       },
   
       total:{
           type: Number,
           default: 0
       },
   
       }, 
       { timestamps : true}
       );
   
       RevimackSchema.methods.toJSON = function(){
       const {__v,password, ...rest} = this.toObject();
       return rest; 
   }
   
   module.exports= model('Revimack', RevimackSchema);