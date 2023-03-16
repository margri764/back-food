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
            .skip( Number (from))
            .limit( Number (limit))
    ])  
   

    res.json({ 
      usuarios

    });
}

const getUserById = async (req,res=response)=> {

    // const { id }  = req.params;
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
            console.log(error);
            return res.status(500).json({
                success: false,
                msg: 'Error al buscar usuario por id'
            });
        }
}

const userPost= async (req, res = response) => {
    
let userVerified;

const user_loginDB = await UserSignUp.findOne({email: req.body.email});
const user = await User.findOne({email: req.body.email} || null);

if( user !== null){
    return res.status(400).json({
        success:false,
        msg:"El Usuario ya existe en Base de Datos"
    })
}

if( user_loginDB==null){
    return res.status(400).json({
        success:false,
        msg:"No existe un usuario logeado"
    })
}

if(user_loginDB.stateAccount == false || user_loginDB == "UNVERIFIED") {
    return res.status(400).json({
        success:false,
        msg:"Usuario eliminado o sin verificar email, Hable con el admninistrador"
    })
}

//si llego hasta axa xq es un usuario autenticado y verificado poer eso mando emailVerified
    userVerified={
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password:req.body.password,
    email: req.body.email,
    emailVerified: true,
    phone: req.body.phone,
    user_login: user_loginDB._id,
}


const userToSave = new User (userVerified);

 
    await userToSave.save();
    res.json({
        success: true,
        msg:'Usuario creado correctamente',
        userToSave
    })


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
    return res.status(500).json({
        success: false,
        msg: 'Error al editar la dirección del usuario'
    });
}


}

const usersDelete= async (req, res) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id,{state:false})
    const usuarioAuth = req.usuarioAuth;

    res.json({       
        user,
        usuarioAuth
        
    });
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

    if( typeRequest === undefined || typeRequest === ''){
        return res.status(400).json({
            success: false,
            msg: "No se incluyo ningun valor al campo TypeRequest"
        })
    }

    try {

        if(typeRequest === "post"){

            const findSetting = await Setting.findOne({user:userToken._id}) ?? null;
            console.log(findSetting);
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
    userPost,
    userPut,
    usersDelete,
    getUserById,
    settingUser,
    getSettingUser
}