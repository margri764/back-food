const { v4: uuidv4 } = require('uuid');

const path = require ('path');

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




module.exports ={ upFiles}