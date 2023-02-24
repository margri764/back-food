

   const {Schema, model} = require ('mongoose');

   const  AppStateSchema = Schema({
   
        staff:{
            type: Schema.Types.ObjectId,
            ref: "Staff",
            required: true
        },
   
        status: {
           type: Boolean, 
           default: true,
        },

        statusApp: {
             type: Array,
        },

        hourRate: [
                   {
                     hour: {
                           type: String,
                           required : true,
                     },
                     status: {
                           type: Boolean,
                           required : true,

                     }
                   }
        ],

        days :{
          type: Array,
        },
       
        msg :{
             type: String,
             default: "Se toman pedidos hasta las 13 y 23hs. Disculpá las molestias. Volvé pronto!!"
        }
       }, 
       { timestamps : true}
       );
   
       AppStateSchema.methods.toJSON = function(){
       const {__v,password, ...app} = this.toObject();

       return app; 
   }
   
   
   module.exports= model('AppState', AppStateSchema);