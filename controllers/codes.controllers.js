const fs   = require('fs');
const path = require('path');
const  Code  = require ('../models/qr.js')
const UserLogin = require('../models/user-login')


const confirmQr = async (req, res) => {

        
    try {
        // Obtener el qr
        const { codeQR }  = req.params;
    
        //busco si existe el codigo en BD
        const codeInDB = await Code.find({
            code:{
                "$regex":codeQR
            }})  ;
    
        //response NO EXISTE
        if(codeInDB.length == 0){
            return res.status(400).json({
                success: false,
                msg: 'Codigo QR no existe'
            });
        }
    
        let pathImage;
    
     //extraigo el objeto del arreglo(el find devuelve un arreglo)
        if(codeInDB.length!= 0 ){
            codeInDB.forEach(code=>{pathImage=code});

            if(pathImage.state == false){
                return res.json({
                    success: false,
                    msg: 'La mascota ha sido removida de la base de datos'
                });

            }
        }
    
    //comparo el codigo leido con el codigo q esta en loginusuario (puese ser q no completo el UC Cargar Usuario y UC Cargar Mascota)
        const user = await UserLogin.findOne({codeQR:pathImage._id})

    
        // Verificar si el código ya esta asignado y si la mascota o codigo sigue valido
        if(pathImage.state == false){
            return res.status(400).json({
                success: false,
                msg: 'Estado de la mascota borrado'
            });
        }
    
           if(pathImage.stateQR == "ASSIGNED") {
    
            // aca deberia mandar los datos de la mascota y del dueño
    
                return res.status(200).json({
                    success: true,
                    msg: 'Código asignado, enviar datos de la mascota',
                    pathImage,
                    user
                })
           }
           
           if(pathImage.stateQR == "UNASSIGNED") {
                return res.status(200).json({
                    success: false,
                    msg: 'Codigo sin asignar, UC Cargar Usuario UC Cargar Mascota',
                    pathImage,
                   
                });
             }
    
            if( user!= undefined){
            return res.status(200).json({
                success: true,
                msg: 'Faltan completar datos de usuario y mascota',
                pathImage,
                user
            })
           }
    
   
           
    
    
  
            
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                msg: 'Ups!! Algo salio mal'
            });
        }
    }

const postCodes =async (req, res)=>{

try {
    
    const { codeQR }  = req.body;


    //traigo el directorio completo

    const files = fs.readdirSync('qrcodes');
    
    for( let file of files){

        let qrObject = {
            code: file,
            status: true,
            statusQR: "UNASSIGNED"
        }

     let code = new Code(qrObject);
     await code.save();
    }
   

    res.status(200).json({
            msg:'desde backend',
        
        })


}catch{
    console.log(error);
    return res.status(500).json({
        success: false,
        msg: 'Ups!! Algo falló en la carga de QR en BD'
    });
} 
}

module.exports={
    postCodes,
    confirmQr
}

