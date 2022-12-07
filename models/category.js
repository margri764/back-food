
const {Schema,model} = require ('mongoose');

const CategorySchema = Schema({

    name :{
        type:String,
        required: [true, 'el nombre es obligatorio']
    },

    state :{
        type:Boolean,
        default: true,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
  }, { timestamps:true}
);

CategorySchema.methods.toJSON = function(){
    const {__v, state, ...category} = this.toObject();
    
    return category; 
}

module.exports= model ('Category', CategorySchema);
