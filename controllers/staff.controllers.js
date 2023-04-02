

const {response} = require ('express');
const bcryptjs = require ('bcryptjs');
const User = require ('../models/user');
const Staff  = require ('../models/staff');
const Role  = require ('../models/role');
const App  = require ('../models/appState');
const { checkHour } = require('../helpers/check-hourly');



const createStaff= async (req, res = response) => {
    
 const { password, email, role, ...rest} = req.body;

//  const roleValid = await Role.findOne({rol: role}) || null;

//  if( roleValid == null){
//     return res.status(401).json({
//         success:false,
//         msg: `No existe el rol: ${role}  en Base de Datos`
//     })
// }
let emailDotCom = email;
emailDotCom = emailDotCom +"@shell.com"
    
let staff = await Staff.findOne({email: emailDotCom}) || null;

if( staff !== null){
    return res.status(400).json({
        success : false,
        msg:"El empleado ya existe en Base de Datos"
    })
}


 staff = new Staff({ password, email: emailDotCom, role, ...rest});

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


    let staff = await Staff.find({ fullName: { $ne: 'no-staff' }, stateAccount: true });
   
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

const staffUpdate= async (req, res) => {
    
try {

    const { id } = req.params;
    const {email, ...rest } = req.body;
    //busco al usuario de la req por id
    let searchStaff = await Staff.findOne({_id : id} ) || null;
    
    if(searchStaff !== null){
      let emailDotCom = email;
       emailDotCom = emailDotCom +"@shell.com"
    
    const tempStaff = {
        ...rest,
        email : emailDotCom
    }   
      
    const staff = await Staff.findByIdAndUpdate( searchStaff._id, tempStaff ,{new:true})

    res.status(200).json({
        success : true,
        staff
    })
 
    }else{
        return res.status(400).json({
            success:false,
            msg: "Usuario no encontrado"
        })
    }

} catch (error) {
    console.log('desde updateStaff: ',error);
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

const deleteStaff = async (req, res) => {

    const { id } = req.params;

    const result = await Staff.findByIdAndUpdate( id, {stateAccount : false}, {new:true} );

    if (result === null) {
        res.status(404).json({ success: false, msg: 'No se encontró el miembro del Staff' });
    } else if (result.nModified === 0) {
        res.status(404).json({ success: false, msg: 'No se actualizó el miembro del Staff' });
    } else {
        res.status(200).json({ 
            success : true,
            msg: "Staff eliminado correctamente"
        });
    }  

}

const pausePlayApp= async (req, res) => {

const { playOrPause, msg } = req.body;
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

let app = await App.findOne( {_id : "642873b34d575a66a74a1e5a"}) || null;

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
    await App.findByIdAndUpdate( "642873b34d575a66a74a1e5a", {status : playOrPause, staff : staff._id, statusApp : tempStates },{new:true})
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
 

app = await App.findByIdAndUpdate( "642873b34d575a66a74a1e5a", {status : playOrPause, staff : staff._id, statusApp : arrState, msg:msg},{new:true})

res.json({       
    success : true,
    app,
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
let app = await App.findOne( {_id : "642873b34d575a66a74a1e5a"}) || null;

if(app == null){
    return res.status(400).json({
        success: false,
        msg : 'Estado de App no encontrado en BD'
    })
}

let rate= null;
let dayArr = [];
let arrCheck = [];
let check = [];

let tempRate = app.hourRate.filter(element => element.status == true);

tempRate.map((element) => {
  rate = element.hour; // agregar la hora al arreglo rate

  element.days.map((day) => {
    dayArr.push(day); // agregar cada día al arreglo dayArr
  });
  arrCheck.push(checkHour(rate, dayArr));
dayArr=[];
}
);

if(arrCheck.includes(true)){
    check = true;
}else{
    check = false;
}


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

    const { hour, status, day } = req.body;

    console.log(hour, status, day);

    if(hour == '' || typeof status != "boolean" ){
        return res.status(400).json({
            success: false,
            msg : 'Los datos ingresados no son correctos, solo "10:00 - 12:00" + true o false ' 
        })
    }

    try {
    
    // son 3!!!!!! id q tengo q pone en duro aca y uno en el GET APP!!!
    const app = await App.findOne( {_id : "642873b34d575a66a74a1e5a"}) || null;
    
    if(app == null){
        return res.status(400).json({
            success: false,
            msg : 'App no encontrada en BD'
        })
    }

    const newHourRate = {
        hour: hour,
        status: status,
        days : day
      };
    

    // son 3!!!!!! id q tengo q pone en duro
    await App.findByIdAndUpdate( "642873b34d575a66a74a1e5a", { $push: { hourRate: newHourRate } } ,{new:true} )
   
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

    const { hour, status, days } = req.body;
    const { id } = req.params;


    if(hour == '' || typeof status != "boolean" ){
        return res.status(400).json({
            success: false,
            msg : 'Los datos ingresados no son correctos, solo "10:00 - 12:00" + true o false ' 
        })
    }

    try {
    
    const app = await App.findOne( {_id : "642873b34d575a66a74a1e5a"}) || null;
    
    if(app == null){
        return res.status(400).json({
            success: false,
            msg : 'App no encontrada en BD'
        })
    }


    const filter = { _id: app._id }; // Define el filtro para encontrar el documento que quieres actualizar
    const update = { $set: { 'hourRate.$[elem].status': status,
                             'hourRate.$[elem].hour': hour,
                             'hourRate.$[elem].days': days,
                          } }; // Define la actualización que quieres hacer
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
   
const updateCustomMsg = async (req, res) => {

    const { msg } = req.body;

    console.log(msg);

    try {
    
    let app = await App.findOne( {_id : "642873b34d575a66a74a1e5a"}) || null;
    
    if(app == null){
        return res.status(400).json({
            success: false,
            msg : 'App no encontrada en BD'
        })
    }

   app = await App.findByIdAndUpdate ( app._id ,{ msg:msg}, {new:true});

    res.json({       
        success : true,
        app
    });
    
    } catch (error) {
        console.log("desde: ",error);
        return res.status(500).json({
            success: false,
            msg: 'Error al editar el msg personalizado'
        });
    }
}

const deleteHourlyRateById = async (req, res) => {

    const { id } = req.params;

    try {
        const app = await App.findOne( {_id : "642873b34d575a66a74a1e5a"}) || null;
    
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

const pausePlayStaffById = async (req, res) => {

    const pauseOrPlay = req.query.pauseOrPlay;
   
      if(pauseOrPlay == undefined){
       return res.status(400).json ({
         success: false,
         msg: "Se debe incluir un query en true o false"
       })
      }
      
       try {
       
         const { id } = req.params;
         const { ...rest } = req.body;
     
         let staff = await Staff.findOne({ _id : id });
     
        //  if(!staff) {
        //    return res.status(400).json({ 
        //      success: false,
        //      msg: "Staff no encontrado",      
        //    });
        //  }
   
         let result;
   
       // si viene FALSE significa q quiero pausar  
         if(pauseOrPlay == "false" ){
            result = await Staff.findByIdAndUpdate( staff._id,  { status: false , rest },{ new:true });
            console.log(pauseOrPlay);
            if (result === null) {
                res.status(404).json({ success: false, msg: 'No se encontró el miembro del Staff' });
            } else if (result.nModified === 0) {
                res.status(404).json({ success: false, msg: 'No se pausó el miembro del Staff' });
            } else {
                res.status(200).json({ 
                    success : true,
                    msg: "Staff pausado correctamente"
                });
            }  
        


         }else{
           result = await Staff.findByIdAndUpdate( staff._id,  { status : true , rest },{ new:true });
         
           if (result === null) {
            res.status(404).json({ success: false, msg: 'No se encontró el miembro del Staff' });
            } else if (result.nModified === 0) {
                res.status(404).json({ success: false, msg: 'No se pausó el miembro del Staff' });
            } else {
                res.status(200).json({ 
                    success : true,
                    msg: "Staff ativado correctamente"
                });
            }  
         }
       } catch (error) {
     
         console.log('desde pausePlayStaffByID: ', error);
         return res.status(500).json({
           success: false,
           msg: "Opps algo salió mal al intentar PAUSAR/ACTIVAR un STAFF"
         })
       }
}
   

module.exports={
    createStaff,
    staffUpdate,
    deleteStaff,
    getUserById,
    createRole,
    pausePlayApp,
    getAppState,
    createHourlyRate,
    updateHourlyRateById,
    deleteHourlyRateById,
    updateCustomMsg,
    getStaff,
    pausePlayStaffById    
}