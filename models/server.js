
const express = require('express');
const cors = require ('cors');
const { dbConnection } = require('../db/config.db');
const path = require ('path');
// const fileUpload = require('express-fileupload');

class Server{

        constructor(){
            this.app = express();
            this.port = 9000;
            this.conectarDB();
            this.middlewares();
            this.routes();
            
        }

    async conectarDB() {
        await dbConnection();
    }
    
    middlewares(){
        this.app.use(cors());
        this.app.use (express.json());
        this.app.use(express.static('public'));
        
        this.app.set('trust proxy', true);
     
      

    }    

    routes(){
        this.app.use('/api/auth', require('../routes/auth.routes'));
        this.app.use('/api/pets',  require('../routes/pets.routes'));
        this.app.use('/api/users', require('../routes/users.routes'));
        this.app.use('/api/codes', require('../routes/codes.routes'));
        
        this.app.get('*', (req, res) => { 
            res.sendFile( path.resolve( __dirname,'../public/index.html') )
            });
              
              
    }

    listen(){
        this.app.listen(this.port)
        console.log('servidor corriendo en puerto', this.port)
    }



}

module.exports = Server;