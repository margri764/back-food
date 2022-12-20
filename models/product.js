



const {Schema, model} = require ('mongoose');


const ProductSchema = Schema({

    name :{
        type: String,
        default: '',
        required : true
    },
 
    price:{
        type: String,
        default: '1',
        required : true
    },

    status : {
        type : Boolean,
        default : true
    },

    stock : {
        type : Boolean,
        default : true
    },

    staff : {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true
    },

    category : {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    
    img: {
        type: String,
        required: true
    },

    comment: {
        type: String,
        default: ''
    },

    ingredients: {
        type: String,
        default: ''
    }

    }, { timestamps:true}
    );

ProductSchema.methods.toJSON = function(){
    const {__v,password, ...product} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return product; 
}


module.exports= model('Product', ProductSchema);

