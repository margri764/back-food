



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

      
      //   noonHour: {
      //    type: [String, Boolean],
      //    default: ['', false]
      //  },

       hourRate: [{
                  hour: {
                     type: String,
                     required : true
                  },
                  status: {
                     type:  Boolean,
                     required : true
                  }
       }],

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
       const {__v,password, ...order} = this.toObject();
       // const {__v,password,_id,...usuario} = this.toObject();
       // usuario.uid= _id;
       return order; 
   }
   
   
   module.exports= model('AppState', AppStateSchema);