
const Category = require ('../models/category');
const Product = require ('../models/product');

const createCategory =  async (req, res) => { 

    try {
        
        const name= req.body.name.toUpperCase(); 
        const user = req.userAuth
  
        const data = {
            name,
            user: user._id
        }

        const category = new Category ( data );
        await category.save();

        res.status(201).json({
            success : true,
            category
        })

} catch (error) {
    console.log('error desde createCategory: ', error);
    let errorMessage = "Oops algo salio mal al intentar crear una categoría"
    if(error.message.includes("Intenta eliminar una categoria que no existe ")){
      errorMessage = error.message;
    }
    return res.status(500).json({
      success: false,
      msg: errorMessage
    })
}
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

    try {
        
        await Category.findByIdAndUpdate( id, {state:false},{new:true});
    
        await Product.updateMany({ category: id }, { status: false });
    
    
        res.status(200).json({
            success: true,
            mas: "Categoria eliminada correctamente"
        }
        );

    } catch (error) {
        console.log('Desde deleteCategory: ', error);
        let errorMessage = 'Ooops algo salio mal al intentar eliminar la categoria';
      
        if (error.message.includes('Intenta eliminar una categoria que no existe')) {
          errorMessage = error.message;
        }
          return res.status(500).json({
              success: false,
              msg: errorMessage
          })
          
  
    }

}

module.exports={
                createCategory,
                getCategory,
                getCategoryById,
                updateCategory,
                deleteCategory
               }
