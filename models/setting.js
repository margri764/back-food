

const {Schema, model} = require ('mongoose');


const SettingSchema = Schema({


      shop: {
        type: Boolean,
      },

      bata: {
        type: Boolean,
      },

      email: {
        type: Boolean,
      },

      farmacia: {
        type: Boolean,
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