const {response} = require ('express');
const User = require ('../models/user');
const UserSignUp = require ('../models/userSignUp');
const Staff = require ('../models/staff');
const Setting = require ('../models/setting');


const userGet = async (req,res=response)=>{

    const { limit , from }=req.query;
    const [ total, usuarios] = await Promise.all([
        User.countDocuments( {state:true}),
        User.find( {state:true} )
            .select('-password') // Excluye el campo 'password'
            .skip( Number (from))
            .limit( Number (limit))
    ])  
   

    res.status(200).json({ 
      usuarios

    });
}

const getUserByToken = async (req,res=response)=> {

    const userToken = req.userAuth

    let emailToCheck = userToken.email.split("@");
    
    let user;
    
    try {
    // depende del valor del email del staff de cada empresa, busca en una u otra coleccion
        
        if(emailToCheck.includes(process.env.EMAILSTAFF)){

            user = await Staff.findById(userToken._id);
        }else{

            user = await User.findById(userToken._id);
            
        }    
    
        if( !user){
            return res.status(400).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        res.status(200).json({ 
            success : true,
            user
        
        });

        } catch (error) {
            console.log("error desde getUserByToken: ",error);
            return res.status(500).json({
                success: false,
                msg: 'Error al buscar usuario por id'
            });
        }
}

const getAllUsers = async (req, res=response)=> {

    try {
        const users = await User.find();

        if (users.length === 0) {
          return res.status(404).json({
            success: false,
            msg: 'No se encontraron usuarios'
          });
        }

        res.status(200).json({ 
        success : true,
        users
    
        });

        } catch (error) {
            console.log("error desde get AllUser: ",error);
            return res.status(500).json({
                success: false,
                msg: 'Error al obtener todos los usuarios'
            });
        }
}

const userPut= async (req, res) => {
    
try {
    
    // const { id } = req.params;
    const { ...rest } = req.body;
    const userToken = req.userAuth

    
    //busco al usuario de la req por id
    const user = await User.findByIdAndUpdate( {_id : userToken._id}, rest,{new:true})

    if (user === null) {
        res.status(404).json({ success: false, msg: 'No se encontró el usuario' });
    } else if (user.nModified === 0) {
        res.status(404).json({ success: false, msg: 'No se actualizó la dirección del usuario' });
    } else {

        res.status(200).json({ 
            success : true,
            user
        });
    }  


} catch (error) {
    console.log("Desde userPut: ", error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';

    if (error.code === 11000) {
        errorMessage = "El número de teléfono ya está en uso."
      } 
    return res.status(500).json({
        success: false,
        msg: errorMessage
    });
}


}

const userDelete= async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, {stateAccount:false}, {new:true})

        if(!user){
            return res.status(400).json({
                success: false,
                masg: 'Usuario no encontrado'
            })
        }
    
        res.status(200).json({    
            success: true,   
            user,
        });
    } catch (error) {
        console.log('desde deleteUser: ', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar usuario'
        });
    }


}

const activeUserAccount= async (req, res) => {

    const { _id } = req.body;

    try {
        const result = await User.findByIdAndUpdate(_id, {stateAccount:true}, {new:true})

        if (result === null) {
            res.status(404).json({ success: false, msg: 'No se encontró el Usuario' });
        } else if (result.nModified === 0) {
            res.status(404).json({ success: false, msg: 'No se activo el Usuario'});
        } else {
            res.status(200).json({ 
                success : true,
                msg: result 
            });
        } 
    
    } catch (error) {
        console.log('desde activeUserAccount: ', error);
        return res.status(500).json({
            success: false,
            msg: 'Error al activar usuario'
        });
    }


}

const getSettingUser = async (req, res) => {

     const userToken = req.userAuth

     try {
     // depende del valor del email del staff de cada empresa, busca en una u otra coleccion
 
        const result = await Setting.findOne( {user: userToken._id} );
        if(result === null){
            return res.status(200).json({
                success : false
            })
        }else{
            return res.status(200).json({
                success : true,
                result
            })

        }
 
 
         } catch (error) {
             console.log("desde getSettingUser: ", error);
             return res.status(500).json({
                 success: false,
                 msg: 'Error al buscar configuraciones'
             });
         }
}

const settingUser = async (req, res) => {
    
    const { bata, shop, farmacia, email, typeRequest } = req.body;

    const userToken = req.userAuth

    try {

        if(typeRequest === "post"){

            const findSetting = await Setting.findOne({user:userToken._id}) ?? null;

            if(findSetting != null || findSetting != undefined){
                return res.status(400).json({
                    success: false,
                    msg: `Ya existe un documento con las Configuraciones para el usuario ${userToken.firstName} ${userToken.lastName}`
                })
            }
            const saveSetting = new Setting ( {bata: bata,  shop: shop,  email: email, farmacia: farmacia, user : userToken._id } );
            await saveSetting.save();

            return res.status(200).json({
                success: true,
                saveSetting
            })
        }

        if(typeRequest === "put"){

           const result = await Setting.findOneAndUpdate( {user: userToken._id}, {bata: bata,  shop: shop,  email: email, farmacia: farmacia, user : userToken._id}, {new : true} );

           if (result === null) {
            res.status(404).json({ success: false, msg: 'No se encontró SETTING' });
           } else if (result.nModified === 0) {
            res.status(404).json({ success: false, msg: 'No se actualizaron las configuraciones de usuario' });
           } else {
            res.status(200).json({ 
                success : true,
                result 
            });
        }  
    
        }

   } catch (error) {
    console.log('error desde settingUser: ', error);
        res.status(500).json({
            msg: 'Error al intentar editar settings de usuarios',
            success: false
        })       
    }
    
};


module.exports={
    userGet,
    userPut,
    userDelete,
    getUserByToken,
    settingUser,
    getSettingUser,
    getAllUsers,
    activeUserAccount,
}