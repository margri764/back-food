

/* En teoria deberia ser una sola orden, salvo q un cliente haga varias compras, cierre el pedido lo pague y
   en el mismo dia se acuerde de algo y vuelva a comprar */

   const {Schema, model} = require ('mongoose');


   const  AppSateSchema = Schema({
   
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

        msg :{
             type: String,
             default: "Se toman pedidos hasta las 13 y 23hs. Disculpá las molestias. Volvé pronto!!"
        }
       }, 
       { timestamps : true}
       );
   
       AppSateSchema.methods.toJSON = function(){
       const {__v,password, ...order} = this.toObject();
       // const {__v,password,_id,...usuario} = this.toObject();
       // usuario.uid= _id;
       return order; 
   }
   
   
   module.exports= model(' AppSate', AppSateSchema);