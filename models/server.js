
const express = require('express');
const cors = require ('cors');
const { dbConnection } = require('../db/config.db');
const path = require ('path');
// const fileUpload = require('express-fileupload');

class Server{

        constructor(){
            this.app = express();
            this.port = process.env.PORT;
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
        this.app.use('/api/user', require('../routes/user.routes'));
        this.app.use('/api/order', require('../routes/order.routes'));
        this.app.use('/api/purchaseOrder', require('../routes/purchaseOrder.routes'));
        this.app.use('/api/staff', require('../routes/staff.routes'));
        this.app.use('/api/product', require('../routes/product.routes'));
        this.app.use('/api/category', require('../routes/category.routes'));




        
        // this.app.get('*', (req, res) => { 
        //     res.sendFile( path.resolve( __dirname,'../public/index.html') )
        //     });
              
              
    }

    listen(){
        this.app.listen(this.port)
        console.log('servidor corriendo en puerto', this.port)
    }



}

module.exports = Server;