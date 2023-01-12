const {response} = require ('express');

const User = require ('../models/user');
const UserSignUp = require ('../models/userSignUp');
const Staff = require ('../models/staff');




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
    res.status(400).json({
        success:false,
        msg:"El Usuario ya existe en Base de Datos"
    })
}

if( user_loginDB==null){
    res.status(400).json({
        success:false,
        msg:"No existe un usuario logeado"
    })
}

if(user_loginDB.stateAccount == false || user_loginDB == "UNVERIFIED") {
    res.status(400).json({
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
    const {...rest } = req.body;

    const userToken = req.userAuth

    console.log(userToken);

    
    //busco al usuario de la req por id
    // let searchUser = await User.findOne({_id : userToken._id} ) || null;
    
    const user = await User.findByIdAndUpdate( {_id : userToken._id}, rest,{new:true})
    if(user !== null){
      

        res.status(200).json({
            success : true,
            user
        })
 
    }else{
        return res.status(400).json({
            success:false,
            msg: "Usuario no encontrado"
        })
    }

} catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        msg: 'Error al editar usuario'
    });
}



    // let user = await User.findByIdAndUpdate( id, {new:true} );

    // const userTemp = {
    //         firstName : user.firstName,
    //         lastName : user.lastName,
    //         email : user.email,
    //         phone: user.phone,
    //         ...rest
    // }

    //  user = new User (userTemp);
 
    // await user.save();

    // res.json({    
    //     msg:true,
    //     // user
    // });
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


module.exports={
    userGet,
    userPost,
    userPut,
    usersDelete,
    getUserById
}