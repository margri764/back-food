const {response} = require ('express');
const moment = require('moment');  

const User = require ('../models/user');
const UserLogin = require ('../models/user-login');
const Code = require ('../models/qr');



const userGet = async (req,res=response)=>{

    const { limit , from }=req.query;
    const [ total, usuarios] = await Promise.all([
        User.countDocuments( {state:true}),
        User.find( {state:true} )
            .skip( Number (from))
            .limit( Number (limit))
    ])  
   

    res.json({ 
        // total,     
      usuarios

    });
}

const userPost= async (req, res = response) => {
    
 
    // const {codeQR} = req.body;
    console.log(req.body);
    let userQR;
    // const actualDay = moment();   
    
        if(req.body.msg.includes("Cuenta verificada")){
            const user_loginDB = await UserLogin.findOne({email: req.body.user.email})
            const user = await User.findOne({email: req.body.user.email} || null)

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

             userQR={
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                password:req.body.user.password,
                email: req.body.user.email,
                emailVerified: true,
                phone: req.body.phone,
                user_login: user_loginDB._id,
                code: req.body.pathImage._id
            }
         }
            if(req.body.msg.includes("Falta crear Usuario")){
                const user_loginDB = await UserLogin.findOne({codeQR: req.body.code} || null)
                const user = await User.findOne({email: req.body.email} || null);
                let codeQR = new Code();
                codeQR = await Code.findByIdAndUpdate( req.body.code, {stateQR:'ASSIGNED'},{new:true});

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

                if(user_loginDB.stateAccount == false || user_loginDB.state == "UNVERIFIED") {
                    res.status(400).json({
                        success:false,
                        msg:"Usuario eliminado o sin verificar email, Hable con el admninistrador"
                    })
                }

                if(user_loginDB.email == false ) {
                    res.status(400).json({
                        success:false,
                        msg:"Usuario eliminado o sin verificar email, Hable con el admninistrador"
                    })
                }
                 userQR={
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password:user_loginDB.password,
                    email: user_loginDB.email,
                    emailVerified: true,
                    phone: req.body.phone,
                    user_login: user_loginDB._id,
                    code: req.body.code
                }
            }
    
    const user = new User (userQR);

 
    await user.save();
    res.json({
        success: true,
        msg:'Usuario creado correctamente',
        user
    })


}

const userPut= async (req, res) => {
    
    const { id } = req.params;
    const {code } = req.body;

    //busco al usuario de la req por id
    const userQR = await User.findById(id);
    let tempCode= [];
    
    //busco el codigo de la req por id
    const codeInDB = await Code.findById(code) ;
    
    
    //response NO EXISTE
    // if(codeInDB.length == 0){
        //     return res.status(400).json({
            //         success: false,
            //         msg: 'Codigo QR no existe'
            //     });
            // }
            
    tempCode.push(userQR.code);
    tempCode.push(codeInDB._id);

    const user = await User.findByIdAndUpdate( id, {code:tempCode}, {new:true} );

    res.json({    
        msg:'put API - controller',
        user, 
    });
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
    usersDelete
}