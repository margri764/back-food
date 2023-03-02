

const {response} = require ('express');
const bcryptjs = require ('bcryptjs');
const User = require ('../models/user');
const Staff  = require ('../models/staff');
const Role  = require ('../models/role');
const App  = require ('../models/appState');
const { checkHourly } = require('../helpers/check-hourly');



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

const getStaff = async (req,res=response)=>{


    let staff  = await Staff.find({
        $and:[
              { stateAccount : true}
            ]})
   
   
    if( !staff){
        return res.status(400).json({
            success: false,
            msg: 'Usuario no encontrado'
        });
    }

    res.status(200).json({ 
        success : true,
        staff

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

const { playOrPause } = req.body;
const staff = req.userAuth; // siempre son user, puede ser staff o cliente

// ***** OJO NO BORRAR!!!  solo se usa la primera vez y lo hago yo. Me creo una cuenta como Staff SUPER_ROLE ********
// *********************** staff/pausePlayApp (desde aca en POSTMAN) *****************************************************
   
// const staffEditor = {
//         date : new Date(),
//         staff :  staff._id,
//         status : playOrPause    
//     };


//     const app = new App ( {state: true, staff: staff._id, statusApp : staffEditor} )

//     await app.save();

//     res.json({       
//         success : true
//     });
//************************* HASTA ACA ********************/

//************************* lo de abajo se comenta la primera vez, hasta el catch *******************

//              RECORDAR !!! poner el id de la app en duro
try {


/* son 3 id q tengo q pone en duro aca,
  uno en el GET APP!!!, 
  dos en createHourly */

const app = await App.findOne( {_id : "63f8b8d794a7c29fe4a94db3"}) || null;

if(app == null){
    return res.status(400).json({
        success: false,
        msg : 'Estado de App no encontrado en BD'
    })
}

if(app.status == playOrPause ){
    return res.status(400).json({
        success: false,
        msg : `La app ya se encuentra en estado ${playOrPause}`
    })
}

//borro las primeras posiciones para q no graben tantos estados
if( app.statusApp.length >5){
    let tempStates = [];
    tempStates = app.statusApp.splice(0,2)

    // son 3!!!!!! id q tengo q pone en duro
    await App.findByIdAndUpdate( "63f8b8d794a7c29fe4a94db3", {status : playOrPause, staff : staff._id, statusApp : tempStates },{new:true})
}

const staffEditor = {
    date : new Date(),
    staff :  staff._id,
    status : playOrPause    
};

//obtengo el array de la base de datos y le agrego el nuevo estado
let arrState = [];
app.statusApp.map((item)=>{ arrState.push(item)})
arrState.push(staffEditor);
 

await App.findByIdAndUpdate( "63f8b8d794a7c29fe4a94db3", {status : playOrPause, staff : staff._id, statusApp : arrState, msg:msg},{new:true})

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

const getAppState= async (req, res) => {


try {

    // son 3!!!!!! id q tengo q pone en duro
const app = await App.findOne( {_id : "63f8b8d794a7c29fe4a94db3"}) || null;

if(app == null){
    return res.status(400).json({
        success: false,
        msg : 'Estado de App no encontrado en BD'
    })
}

let rate = [];
app.hourRate.forEach(element => { rate.push(element.hour)});
const check = checkHourly( rate);
    res.json({       
        success : true,
        app,
        check 
    });

} catch (error) {
    console.log("desde getAppState: ",error);
    return res.status(500).json({
        success: false,
        msg: 'Error al obtener el estado de la app'
    });
}
}

const createHourlyRate = async (req, res) => {

    const { hour, status } = req.body;

    console.log(hour, status);

    if(hour == '' || typeof status != "boolean" ){
        return res.status(400).json({
            success: false,
            msg : 'Los datos ingresados no son correctos, solo "10:00 - 12:00" + true o false ' 
        })
    }

    try {
    
    // son 3!!!!!! id q tengo q pone en duro aca y uno en el GET APP!!!
    const app = await App.findOne( {_id : "63f8b8d794a7c29fe4a94db3"}) || null;
    
    if(app == null){
        return res.status(400).json({
            success: false,
            msg : 'App no encontrada en BD'
        })
    }

    const newHourRate = {
        hour: hour,
        status: status,
      };
    

    // son 3!!!!!! id q tengo q pone en duro
    await App.findByIdAndUpdate( "63f8b8d794a7c29fe4a94db3", { $push: { hourRate: newHourRate } } ,{new:true} )
   
    const updatedApp = await App.findOne(app._id); // Busca el documento actualizado

    res.json({       
        success : true,
        updatedApp
    });
    

    } catch (error) {
        console.log("desde createHourlyRate: ",error);
        return res.status(500).json({
            success: false,
            msg: 'Error al crear el horario de atencion'
        });
    }
}
    
const updateHourlyRateById = async (req, res) => {

    const { hour, status } = req.body;
    const { id } = req.params;


    if(hour == '' || typeof status != "boolean" ){
        return res.status(400).json({
            success: false,
            msg : 'Los datos ingresados no son correctos, solo "10:00 - 12:00" + true o false ' 
        })
    }

    try {
    
    const app = await App.findOne( {_id : "63f8b8d794a7c29fe4a94db3"}) || null;
    
    if(app == null){
        return res.status(400).json({
            success: false,
            msg : 'App no encontrada en BD'
        })
    }


    const filter = { _id: app._id }; // Define el filtro para encontrar el documento que quieres actualizar
    const update = { $set: { 'hourRate.$[elem].status': status } }; // Define la actualización que quieres hacer
    const options = { arrayFilters: [{ 'elem._id': id }] }; // Define el filtro para el objeto dentro del array que quieres actualizar

   await App.updateOne(filter, update, options);

   const updatedApp = await App.findOne(filter); // Busca el documento actualizado

    
    res.json({       
        success : true,
        updatedApp
    });
    
    } catch (error) {
        console.log("desde updateHourlyRateById: ",error);
        return res.status(500).json({
            success: false,
            msg: 'Error al editar el horario de atencion'
        });
    }
}
   
const deleteHourlyRateById = async (req, res) => {

    const { id } = req.params;

    try {
        const app = await App.findOne( {_id : "63f8b8d794a7c29fe4a94db3"}) || null;
    
        if(app == null){
            return res.status(400).json({
                success: false,
                msg : 'App no encontrada en BD'
            })
        }
   
          const result = app.hourRate.pull({ _id: id });

          await app.save();

          const updatedApp = await App.findOne(app._id); // Busca el documento actualizado


          if (result.modifiedCount === 0) {
            res.status(404).json({ mensaje: 'No se encontró el horario' });
          } else {
            res.status(200).json({ 
                success: true,
                msg: 'Horario eliminado con éxito',
                updatedApp
            });
          }  
    
    } catch (error) {
        console.log("desde deleteHourlyRateById: ",error);
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar el horario de atencion'
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
    pausePlayApp,
    getAppState,
    createHourlyRate,
    updateHourlyRateById,
    deleteHourlyRateById,
    getStaff    

}