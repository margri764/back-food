

const {Schema, model} = require ('mongoose');



const EmployeeSchema = Schema({

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

    EmployeeSchema.methods.toJSON = function(){
    const {__v,password, ...employee} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return employee; 
}


module.exports= model('Employee', EmployeeSchema);