
const Category = require ('../models/category');




const createCategory =  async (req, res) => { 

    const name= req.body.name.toUpperCase(); 
    
    console.log(name);
    
    const categoryDB = await Category.findOne({name});
    if(categoryDB){
        return res.status(400).json({
            msg:` La categoria ${categoryDB.name} ya existe `
        });
    }
    const data = {
        name,
        user: req.userAuth._id
    }

    const category = new Category ( data );
    await category.save();

    res.status(201).json({
        success : true,
        category
    })
}



const getCategory = async (req,res)=>{

    const { limite=5 , desde =0 }=req.query;

    const [ total, category] = await Promise.all([

        Category.countDocuments( {state:true}),
        Category.find( {state:true} )
            .populate('usuario','name')
            .skip( Number (desde))
            .limit( Number (limite))
    ])
   
    res.json({ 
        total,     
        category

    });
}

const getCategoryById = async ( req, res ) =>{
    
    const { id } = req.params;
    const category = await Category.findById( id ).populate ('user','name');
    
    res.status(200).json(
        category
    );
}


   
const updateCategory = async ( req, res )=>{

    const { id } = req.params;
    const { state, user, ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.usuario = req.usuarioAuth._id;

    const category = await Category.findByIdAndUpdate ( id, data, {new: true} );

    res.status(200).json(
        category
    );

}

const deleteCategory = async ( req, res )=>{

    const { id } = req.params;
    const category = await Category.findByIdAndUpdate( id, {state:false},{new:true});

    res.status(200).json(
        category
    );

}

 


module.exports={
    createCategory,
    getCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
  
}
