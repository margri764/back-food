const {Schema, model} = require ('mongoose');





const UserSchema = Schema({

    firstName:  {
        type:String,
        default:'',
        trim: true
    },
    
    lastName:  {
        type:String,
        default:'',
        trim: true

    },

    password: {
        type: String,
        default: ''
    },

    resetPasswordToken: {
        type: String,
      },
    
    resetPasswordExpires: {
        type: Date,
    },

    email: {
        type: String,
        default:'',
        // unique: true,
    },
 
    phone:{
        type: String,
        default:'',
        unique: true,
    },

    addressDelivery :{
        type: String,
        default: ''
    },

    addressFavorite :{
        type: String,
        default: ''
    },

    role: {
        type: String,
        required: true,
        default: 'CLIENT_ROLE',
    },

    stateAccount: {
        type: Boolean,
        default: true
    },

    google: {
        type: Boolean,
        default: false
    },

    user_login:{
        type: Schema.Types.ObjectId,
        ref: "UserLogin",
        required: true
     },

    }, { timestamps:true}
    );

UserSchema.methods.toJSON = function(){
    const {__v,password,...user} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return user; 
}


module.exports= model('User', UserSchema);