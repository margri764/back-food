const { response } = require ('express');
const moment = require('moment');  

const { petAge } = require ('../helpers/pet-age');
const { findOneAndDelete, findOne } = require('../models/pet');
const Pet = require ('../models/pet');
const Code = require ('../models/qr');
const User = require ('../models/user');






const signUpPet = async ( req , res=response )=>{

    try { 
        const{ owner, code, ...rest} = req.body


    //OJO SE GRABA MAS DE UNA VEZ UNA MASCOTA, NO VERIFICA DUPLICADOS EN BD


      console.log("pet code: ",req.body);

//   busco al usuario de la req por id y extraigo sus codigos para armar el arreglo
//en la primer mascota el id "owner" es el del userlogin, siempre devuelve null xq no esta como id en User
    const userQRSavedInDB = await User.findById(owner) || null;
    let tempCode= [];
    
    let codeQR = new Code();

    let user;

    const actualDay = moment();   

    if(userQRSavedInDB == null){
        return res.status(401).json({
            success: false,
            msg: 'Error al registrar mascota'
        });
        // Actualizar mascota
    }
    
       
        if(!userQRSavedInDB.code.includes(code)){
            console.log("no incluye el codigo" )
            tempCode=userQRSavedInDB.code;
            tempCode.push(code);
            codeQR = await Code.findByIdAndUpdate( code, {stateQR:'ASSIGNED'},{new:true});
            user = await User.findByIdAndUpdate( owner, {code:tempCode},{new:true} );
            await user.save();
        }else{
            console.log("aca llego")
            codeQR = await Code.findByIdAndUpdate( code, {stateQR:'ASSIGNED'},{new:true});
       }    

       const age = await petAge( req.body.birthDay);
       const pet ={
           ...rest,
           owner : owner,
           code: code,
           age: age,
           createdAt: actualDay,
           updatedAt:actualDay
       }

       const petDB = new Pet( pet );

    
        await codeQR.save();
   
        await petDB.save();
        res.json({
            success: true,
            petDB
        })

} catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            msg: 'Error al registrar mascota'
        });
    }
    
    }
  


const getPetById = async (req, res)=>{

    try {
    
        const { id } = req.params;
        
        console.log(id);
        const pet = await Pet.findOne({code: id} ).populate ("owner") || null;

        if(pet ==null){
            return res.status(400).json({
                success:false,
                msg: "Mascota no encontrada, hable con el administrador"
            })
        }
                                                    
        res.json(pet);

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            msg: 'Error al adquirir mascota'
        });
    }
}

const petDelete= async (req, res) => {

    try {

    const { id } = req.params;
// busca una mascota q tenga como "code" el id q recibe como params o q devuelva null
    let searchPet = await Pet.findOne({code: id} ) || null;

    //si la encuentra, q ahora la busque por el id de la mascota (no por code) y q actualice la propiedad "state" a false
     if(searchPet !== null ){

        await Pet.findByIdAndUpdate( searchPet._id, {state:false}, {new:true});
       
      
        const owner = await User.findById( {_id: searchPet.owner} ) || null;   
        console.log(owner)

        if(owner == null){

            return res.status(400).json({
                success:false,
                msg: "La mascota que se quiere eliminar no pertenece a al usuario registrado!"
            })
        }
        
        if( owner.code.includes(searchPet.code) ){
            
            await User.findByIdAndUpdate( {_id: searchPet.owner}, {$pull: {code: searchPet.code}}) || null;
            await Code.findByIdAndUpdate({_id: searchPet.code}, {state : false})
            
             res.status(200).json({   
                success: true,
                msg: "Mascota borrada correctamente de la base de datos",    
            });
        } else{
            //no esta el codigo en ese dueño
            console.log("ese codigo no esta en ese dueño")
        }
    
    }

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            msg: 'Error al adquirir mascota'
        });
            
    }

}

const petUpdate= async (req, res) => {
    
    const { id } = req.params;
    const {code, ...rest } = req.body;

    //busco al usuario de la req por id
    let searchPet = await Pet.findOne({code: id} ) || null;
 
    if(searchPet !== null){
      
        let newPet = await Pet.findByIdAndUpdate( searchPet._id, rest,{new:true})

        res.status(200).json({
            success:true,
            msg: "Mascota editada correctamente",
            newPet
        })
 
    }else{
        return res.status(400).json({
            success:false,
            msg: "Mascota no encontrada"
        })
    }

 
}




module.exports={
    signUpPet,
    getPetById,
    petDelete,
    petUpdate
}