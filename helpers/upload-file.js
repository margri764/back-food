const { v4: uuidv4 } = require('uuid');

const path = require ('path');
const { json } = require('express');

const validExtension = ( file , res )=>{

    try {

        const sliceName = file.name.split('.'); 
        const fileExtension = sliceName[ sliceName.length - 1 ];
        
        // Validar extension
        const onlyThisExtension = ['png', 'jpg', 'jpeg'];
        if ( !onlyThisExtension.includes( fileExtension ) ) {
    
            throw new Error (`Formato ${ fileExtension } no es una extensión válida. Solo formato ${onlyThisExtension}`)
    
        }else{
        //si es válida la extension en el controller continua    
            return true
        }
        
    } catch (error) {

        
        return res.status(400).json({
            msj: `${error}`
        })

    }
}
const upFiles = (files) =>{ 

    return new Promise ( ( resolve, reject ) => { 
    

        const { file } = files; 
        const sliceName = file.name.split('.');
        const extension = sliceName[sliceName.length-1];
        
        const validExtension = [ 'png', 'jpg', 'jpeg',];
        if(!validExtension.includes(extension)){
            
            return reject (`la extension no esta permitida, solo archivos ${validExtension}`)
        }
        

        const newName = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/img', newName);

        file.mv(uploadPath, (err) => { 
        if (err) {
            return reject (err);

        }

        resolve( uploadPath );
        }) 



    });

        
}




module.exports ={
                 upFiles,
                 validExtension
                }