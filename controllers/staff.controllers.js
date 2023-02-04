

const {response} = require ('express');
const bcryptjs = require ('bcryptjs');
const User = require ('../models/user');
const Staff  = require ('../models/staff');
const Role  = require ('../models/role');
const App  = require ('../models/AppState');



const userPost= async (req, res = response) => {
    
 const { password, email, role, ...rest} = req.body;

 const roleValid = await Role.findOne({rol: role}) || null;

 if( roleValid == null){
    return res.status(401).json({
        success:false,
        msg: `No existe el rol: ${role}  en Base de Datos`
    })
}

    
let staff = await Staff.findOne({email: email}) || null;

if( staff !== null){
    return res.status(400).json({
        success : false,
        msg:"El empleado ya existe en Base de Datos"
    })
}


 staff = new Staff({ password, email, role, ...rest});

// encriptar contraseña
const salt = bcryptjs.genSaltSync();
staff.password = bcryptjs.hashSync(password,salt);


await staff.save();

return res.status(200).json({
        success: true,
        staff
    })

}

const createRole= async (req, res = response) => {
    
    const { role } = req.body;
   
    const roleValid = await Role.findOne({role: role}) || null;
   
    if( roleValid ){
       return res.status(400).json({
           success:false,
           msg: `Ya existe el rol: ${role}  en Base de Datos`
       })
   }
   
    const roleSave = new Role({ role : role });
   
   
   
   await roleSave.save();
   
   return res.status(200).json({
           success: true,
       })
   
}

const userGet = async (req,res=response)=>{

    const { limit , from }=req.query;
    const [ total, usuarios] = await Promise.all([
        User.countDocuments( {state:true}),
        User.find( {state:true} )
            .skip( Number (from))
            .limit( Number (limit))
    ])  
   
    // NO SE PUEDE LLAMAR UN EMPLEADO QUE ESTA BLOQUEADO O ELIMINADO

    // if(staff !== null){

    //     if( staff.stateAccount == false){
    //        return  res.status(400).json({
    //             success:false,
    //             msg:"Empleado eliminado o bloqueado"
    //         })
    //     }
    // }

    res.json({ 
      usuarios

    });
}

const getUserById = async (req,res=response)=>{

    const { id }  = req.params;

    
    console.log(id);

    //busco al usuario de la req por id
    let user = await User.findById(id);
   
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
}


const userPut= async (req, res) => {
    
try {
    

    const { id } = req.params;
    const {...rest } = req.body;
    // console.log(req.params,req.body);
    
    //busco al usuario de la req por id
    let searchUser = await User.findOne({_id : id} ) || null;
    
    if(searchUser !== null){
      
        const user = await User.findByIdAndUpdate( searchUser._id, rest,{new:true})

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

const pausePlayApp= async (req, res) => {

const { playOrPause, ...rest } = req.body;
const staff = req.userAuth; // siempre son user, puede ser staff o cliente

try {

const app = await App.findOne( {_id : "63de9ae39b37004d5306da3f"}) || null;

if(app == null){
    return res.status(400).json({
        success: false,
        msg : 'Estado de App no encontrado en BD'
    })
}

// ***** OJO NO BORRAR!!!  solo se usa la primera vez y lo hago yo. Me creo una cuenta como Staff SUPER_ROLE ********
    // const staffEditor = {
    //     date : new Date(),
    //     staff :  staff._id,
    //     status : playOrPause    
    // };

    // const app = new App ( {state: true, staff: "639137f05c777a9e951281b2", statusApp : staffEditor})

    // await app.save();
//************************* HASTA ACA ********************/

const staffEditor = {
    date : new Date(),
    staff :  staff._id,
    status : playOrPause    
};

let stateFromDB = [];
let arrState = [];
app.statusApp.map((item)=>{ stateFromDB.push(item)})
console.log(stateFromDB);
stateFromDB.push(staffEditor);
 

    // id de la app en duro?
     await App.findByIdAndUpdate( "63de9ae39b37004d5306da3f", {state : playOrPause, staff : staff._id, statusApp : arrState, ...rest },{new:true})

    res.json({       
        success : true
    });

} catch (error) {
    console.log("desde pausePlayApp: ",error);
    return res.status(500).json({
        success: false,
        msg: 'Error al editar el estado de la app'
    });
}
}


module.exports={
    userGet,
    userPost,
    userPut,
    usersDelete,
    getUserById,
    createRole,
    pausePlayApp
}