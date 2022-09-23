const {Schema, model} = require ('mongoose');





const UserSchema = Schema({

    firstName:  {
        type:String,
        default:''
    },
    
    lastName:  {
        type:String,
        default:''
    },

    password: {
        type: String,
        default:''
    },

    email: {
        type: String,
        default:'',
        unique: true,
    },
    // emailVerified: {
    //     type: Boolean,
    //     default: false
    // },

    phone:{
        type: Number,
        default:''
    },

    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: [ 'ADMIN_ROLE','USER_ROLE']
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