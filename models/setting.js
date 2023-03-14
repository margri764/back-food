

const {Schema, model} = require ('mongoose');


const SettingSchema = Schema({


    shop: {
        type: String,
      },
      bata: {
        type: String,
      },
      email: {
        type: Boolean,
      },
      farmacia: {
        type: String,
      },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
     },

    }, { timestamps:true}
    );

SettingSchema.methods.toJSON = function(){
    const {__v,password,...user} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return user; 
}


module.exports= model('Setting', SettingSchema);