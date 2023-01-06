const {Schema, model} = require ('mongoose');

const userSignUpSchema = Schema({

    firstName:  {
        type:String,
        default:''
    },
    
    lastName:  {
        type:String,
        default:''
    },
    
    email: {
         type: String, 
         required: true,
        //  unique: true 
    },
    
    phone:{
        type: String,
        default:''
    },

    password:{
        type:String,
        required: true 
    },

   code:{
       type: String,
       required: true
   },

    stateAccount :{
        type: Boolean,
        default: true
    },   

    state: {
         type: String,
         required: true,
         default: 'UNVERIFIED'
    },

}, { timestamps:true}
);
  

userSignUpSchema.methods.toJSON = function(){
    const {__v,...rest} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return rest; 
}


module.exports= model('UserSignUp', userSignUpSchema);