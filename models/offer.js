
const {Schema, model} = require ('mongoose');


const OfferSchema = Schema({

    name :{
        type: String,
        default: '',
        required : true
    },
 
    price:{
        type: Number,
        default: '1',
        required : true,
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

    stockQuantity : {
        type : Number,
        default: 1
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

    OfferSchema.methods.toJSON = function(){
    const {__v,password, ...offer} = this.toObject();
    // const {__v,password,_id,...usuario} = this.toObject();
    // usuario.uid= _id;
    return offer; 
}


module.exports= model('Offer', OfferSchema);

