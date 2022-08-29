
const {Schema, model} = require ('mongoose');

const PetSchema = Schema({

    name:  {
        type:String,
        required: [true, 'el nombre es obligatorio']
    },
    
    avatar: {
        type: String,
        // required: 'la img es obligatoria',
    },
    
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    vaccine: {
        type: Object,
        required: true
    },
    
    birthDate: {
        type: Date ,
    },

    age: {
        type: Number,
        default: 0
    },
    
    comments: {
        type: String,
        default: ''
    },
    
    state: {
        type: Boolean,
        default: true
    },
    
    createdAt:{
         type: Date,
         required: true
    },

    code:{
        type: Schema.Types.ObjectId,
        ref: "Code",
        required: true
    },

 }, { timestamps:true}
    );

PetSchema.methods.toJSON = function(){
    const {__v,password,...pet} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return pet; 
}


module.exports= model('Pet', PetSchema);