const {response} = require ('express');
const bcryptjs = require ('bcryptjs');
const Staff  = require ('../models/staff');
const Role  = require ('../models/role');
const App  = require ('../models/appState');
const { checkHour } = require('../helpers/check-hourly');

const createStaff= async (req, res = response) => {
    
 try {
    
 const { password, email, role, ...rest} = req.body;

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
    
} catch (error) {
    console.log('Error desde createStaff: ', error);
    
    let errorMessage = 'Ups algo salió mal, hable con el administrador';

    if (error.code === 11000) {
        errorMessage = "El número de teléfono ya está en uso."
    } else if (error.message.includes("role")){
        errorMessage = error.message;
    }
        return res.status(500).json({
            success: false,
            msg: errorMessage

        })
    
}       

}

const createRole= async (req, res = response) => {
    
    try {
  
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

    } catch (error) {
        console.log('error desde createRole: ', error);
        let errorMessage = 'Ups algo salió mal, hable con el administrador';
   
        if(error.message.includes("no es un usuario SUPER_ROLE, no puede realizar esta acción") ){
            errorMessage = error.message
        }
            return res.status(500).json({
                success: false,
                msg: errorMessage
            })
    }
   
}

const getStaff = async (req,res=response)=>{


    let staff = await Staff.find({ fullName: { $ne: 'ingreso-orden' }, stateAccount: true });
   
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
    const { role, phone, address, password } = req.body;
    const salt = bcryptjs.genSaltSync();
    const passwordEncripted = bcryptjs.hashSync(password,salt);

    const tempStaff = {
        role: role,
        phone: phone,
        address: address,
        password : passwordEncripted
    }   
      
    const staff = await Staff.findByIdAndUpdate( id, tempStaff ,{new:true})

    return res.status(200).json({
        success : true,
        staff
    })
 

} catch (error) {
    console.log('Error desde staffUpdate: ',error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';
    
    if(error.message.includes("role")){
      errorMessage = error.message;
    }
    return res.status(500).json({
        success: false,
        msg: errorMessage
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

    try {
        
    const result = await Staff.findByIdAndUpdate( id, {stateAccount : false}, {new:true} );

    if (result === null) {
        res.status(404).json({ success: false, msg: 'No se encontró el miembro del Staff' });
    } else if (result.nModified === 0) {
        res.status(404).json({ success: false, msg: 'No se actualizó el estado del Staff' });
    } else {
        res.status(200).json({ 
            success : true,
            msg: "Staff eliminado correctamente"
        });
    }  

    } catch (error) {
       console.log('error desde deleteStaff: ', error);
       let errorMessage = 'Ups algo salió mal, hable con el administrador';

       return res.status(500).json({
           success: false,
           msg: errorMessage
       });     
    }


}

const createApp= async (req, res) => {

    try {

    const staff = req.userAuth; 
    
    /*solo se usa la primera vez y lo hago yo. Me creo una cuenta como Staff SUPER_ROLE ********
    *********************** staff/pausePlayApp (desde aca en POSTMAN) *******************/
       
    const staffEditor = {
            date : new Date(),
            staff :  staff._id,
            status : true    
        };
    
    
        const app = new App ( {state: true, staff: staff._id, statusApp : staffEditor} )
    
        await app.save();
    
        res.json({       
            success : true
        });
    
    } catch (error) {
        console.log("desde Create App: ",error);
        return res.status(500).json({
            success: false,
            msg: 'Error al editar el estado de la app'
        });
    }
}

const pausePlayApp = async (req, res) => {

const { playOrPause, msg } = req.body;

const staff = req.userAuth; 

try {

let app = await App.findOne( {_id : process.env.APP_ID}) ;

if(!app){
    return res.status(400).json({
        success: false,
        msg : 'Estado de App no encontrado en BD'
    })
}

//borro las primeras posiciones para q no graben tantos estados
if( app.statusApp.length > 5){
    let tempStates = [];
    tempStates = app.statusApp.splice(0,2)

    await App.findByIdAndUpdate( process.env.APP_ID, {status : playOrPause, staff : staff._id, statusApp : tempStates },{new:true})
}

const staffEditor = {
                    date : new Date(),
                    staff :  staff._id,
                    status : playOrPause    
};

//obtengo el array de la base de datos y le agrego el nuevo estado
let arrState = [];
app.statusApp.map((item) => { arrState.push(item)})
arrState.push(staffEditor);
 

app = await App.findByIdAndUpdate( process.env.APP_ID, {status : playOrPause, staff : staff._id, statusApp : arrState, msg:msg},{new:true})

res.json({       
    success : true,
    app,
});

} catch (error) {
    console.log("desde pausePlayApp: ", error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';

    return res.status(500).json({
        success: false,
        msg: errorMessage
    });
}
}

const getAppState = async (req, res) => {

try {
    let app = await App.findOne( {_id : process.env.APP_ID}) || null;

    let rate= null;
    let dayArr = [];
    let arrCheck = [];
    let check = [];

    let tempRate = app.hourRate.filter(element => element.status == true);

    tempRate.map( (element) => {
        rate = element.hour; // agregar la hora al arreglo rate
        element.days.map((day) => {
            dayArr.push(day); // agregar cada día al arreglo dayArr
        });
            
        const isValid =  checkHour(rate, dayArr);
        arrCheck.push(isValid);
    });

      if(arrCheck.includes(true)){
        check = true
      }else{
        check = false
      }
        res.json({       
            success : true,
            app,
            check 
        });

} catch (error) {
    console.log("desde getAppState: ",error);
    let errorMessage = 'Ups algo salió mal, hable con el administrador';

    return res.status(500).json({
        success: false,
        msg: errorMessage
    });
}
}

const createHourlyRate = async (req, res) => {

    const { hour, status, days } = req.body;

    try {
    
    const app = await App.findOne( {_id : process.env.APP_ID});
    
    if(!app){
        return res.status(400).json({
            success: false,
            msg : 'App no encontrada en BD'
        })
    }

    const newHourRate = {
        hour: hour,
        status: status,
        days : days
      };

      app.hourRate.push(newHourRate);

      const updatedApp = await app.save();

    res.json({       
        success : true,
        updatedApp
    });
    

    } catch (error) {
        console.log("desde createHourlyRate: ",error);
        let errorMessage = 'Ups algo salió mal, hable con el administrador';

        return res.status(500).json({
            success: false,
            msg: errorMessage
        });
    }
}
    
const updateHourlyRateById = async (req, res) => {

    const { hour, status, days } = req.body;
    const { id } = req.params;

    try {
    
    const app = await App.findOne( {_id : process.env.APP_ID});
    
    if(!app){
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
        console.log("desde updateHourlyRateById: ", error);
        let errorMessage = 'Ups algo salió mal, hable con el administrador';

        return res.status(500).json({
            success: false,
            msg: 'Error al editar el horario de atencion'
        });
    }
}
   
const updateCustomMsg = async (req, res) => {

    const { msg } = req.body;

    try {
    
    let app = await App.findOne( {_id : process.env.APP_ID});
    
    if(!app){
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
        console.log("desde updateCustomMsg: ",error);
        let errorMessage = 'Ups algo salió mal, hable con el administrador';

        return res.status(500).json({
            success: false,
            msg: errorMessage
        });
    }
}

const deleteHourlyRateById = async (req, res) => {

    const { id } = req.params;

    try {
        const app = await App.findOne( {_id : process.env.APP_ID});
    
        if(!app){
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
        console.log("desde deleteHourlyRateById: ", error);
        let errorMessage = 'Ups algo salió mal, hable con el administrador';

        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar el horario de atencion'
        });
    }
}

const pausePlayStaffById = async (req, res) => {

    const pauseOrPlay = req.query.pauseOrPlay;
   
       try {
       
         const { id } = req.params;
         const { ...rest } = req.body;
     
         let staff = await Staff.findOne({ _id : id });
     
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
        let errorMessage = 'Ups algo salió mal, hable con el administrador';

         return res.status(500).json({
           success: false,
           msg: errorMessage
         })
       }
}
   

module.exports={
    createStaff,
    staffUpdate,
    deleteStaff,
    createRole,
    pausePlayApp,
    getAppState,
    createHourlyRate,
    updateHourlyRateById,
    deleteHourlyRateById,
    updateCustomMsg,
    getStaff,
    pausePlayStaffById,
    createApp    
}