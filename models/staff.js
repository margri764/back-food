

const {Schema, model} = require ('mongoose');



const StaffSchema = Schema({

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
        // unique: true,
    },
 
    phone:{
        type: String,
        default:'',
    },

    address :{
        type: String,
        default: ''
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

    }, { timestamps:true}
    );

    StaffSchema.methods.toJSON = function(){
    const {__v,password, ...staff} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return staff; 
}


module.exports= model('Staff', StaffSchema);