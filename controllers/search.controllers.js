
const Product = require ('../models/product')


const getProductSearch = async ( req, res) =>{
    
    const querySearch = req.query.nameItem;

 
    try {
   
        regex = querySearch;
        const [ product ] = await Promise.all([    
         
            Product.find ({
                name:{ 
                "$regex": regex,
                "$options": "is"
            }})
         
           ]);


console.log(product);
       
        res.status(200).json({ 
           product : product

        });
    } catch (error) {
        res.status(501).json({
            msg: 'base de datos no operativa'
        })  
          
    }


}


module.exports = {getProductSearch }