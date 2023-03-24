

const {Schema, model} = require ('mongoose');



const StaffSchema = Schema({

    fullName:  {
        type:String,
        default:'',
        required: true
    },
    
    password: {
        type: String,
        default:'',
        required: true
    },

    email: {
        type: String,
        default:'',
        unique: true,
        required: true

    },
 
    phone:{
        type: String,
        default:'',
        required: true
    },

    address :{
        type: String,
        default: ''
    },

    role: {
        type: String,
        required: true,
        default: 'STAFF_ROLE',
        emun: [ 'ADMIN_ROLE','STAFF_ROLE', 'SUPER_ROLE']
    },

    stateAccount: {
        type: Boolean,
        default: true
    },
    
    status: {
        type: Boolean,
        default: true
    },
    }, { timestamps:true}
    );

    StaffSchema.methods.toJSON = function(){
    const {__v, password, ...staff} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return staff; 
}


module.exports= model('Staff', StaffSchema);