
const Product = require ('../models/product');
const PurchaseOrder = require('../models/purchaseOrder');
const User = require ('../models/user')


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
            product

        });
    } catch (error) {
        return res.status(501).json({
            msg: 'base de datos no operativa'
        })  
          
    }


}

const getUserSearch = async (req, res) => {

    const querySearch = req.query.userSearch;
  
    console.log(querySearch);
    
    try {
      const regex = new RegExp(querySearch.split(/\s+/).join('.*'), 'i'); // insensible a mayusculas y minusculas
      const users = await User.find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } }
        ]
      });
  
      console.log(users);
  
      res.status(200).json({
        success: true,
        users
         });

    } catch (error) {
      console.log('Error en getUserSearch:', error);
      return res.status(501).json({ msg: 'La base de datos no está disponible' });
    }
};

const getOrderSearch = async (req, res) => {

  const querySearch = req.query.orderSearch;

  try {
    const regex = new RegExp(querySearch.split(/\s+/).join('.*'), 'i'); // insensible a mayusculas y minusculas
    const orders = await PurchaseOrder.find()
    .populate({
      path: 'user',
      match: {
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } }
        ]
      },
      select: 'firstName lastName'
    })
    .lean();

    // Filtramos los pedidos que no tengan usuario
    const filteredOrders = orders.filter((order) => order.user !== null);


    res.status(200).json({
      success: true,
      orders: JSON.parse(JSON.stringify(filteredOrders))
    });

  } catch (error) {
    console.log('Error en getOrderSearch:', error);
    return res.status(501).json({ msg: 'La base de datos no está disponible' });
  }
};

  
module.exports = {getProductSearch, getUserSearch, getOrderSearch }