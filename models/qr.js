const {Schema, model} = require ('mongoose');

const codeSchema = Schema({


    code: { 
        type: String,
        required: true 
        },

    state :{
        type: Boolean,
        default: true
    },   

    stateQR: {
         type: String,
         required: true,
         default: 'UNASSIGNED' 
    } 
    }, { timestamps:true}
   );

codeSchema.methods.toJSON = function(){
    const {__v,...rest} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return rest; 
}


module.exports= model('Code', codeSchema);
