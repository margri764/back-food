
const express = require('express');
const path = require('path');
const cors = require ('cors');
var cookieParser = require('cookie-parser');
const { dbConnection } = require('../db/config.db');
const fileUpload = require('express-fileupload');
const  startCronJob  = require('../tasks/delete-tempOrders');


class Server{

    constructor(){
        this.app = express();
        // this.port = 8000;
        this.port = process.env.PORT;
        this.conectarDB();
        this.middlewares();
        this.routes();
        startCronJob();
        
    }

    async conectarDB() {
        await dbConnection();
    }
    
    middlewares(){

        const whiteList = [process.env.ORIGIN1, 
            "http://192.168.1.103:8081",
            "http://192.168.1.103:8080",
            "http://127.0.0.1:8080",
            "http://127.0.0.1:8081",
            "https://www.revimackagro.com", 
            "https://www.feintdevs.com",
            "https://www.barrozoautomotores.com"
        ];
        this.app.use(express.json());
        this.app.use(cookieParser());  
        this.app.use(cors(
                            {
                              origin: function (origin, callback) {
                                //   console.log("😲😲😲 =>", origin);
                                  if (!origin || whiteList.includes(origin)) {
                                      return callback(null, origin);
                                  }
                                  return callback(
                                      "Error de CORS origin: " + origin + " No autorizado!"
                                  );
                              },
                              credentials: true,
                          }
                          )
        );
        
        this.app.use(express.static('public'));
        this.app.set('trust proxy', true);
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));


    }    

    routes(){
        // this.app.use('/api/send-email', require('../routes/email.routes'));
        this.app.use('/api/auth', require('../routes/auth.routes'));
        this.app.use('/api/auth/renewToken', require('../routes/auth.routes'));
        this.app.use('/api/user', require('../routes/user.routes'));
        this.app.use('/api/order', require('../routes/order.routes'));
        this.app.use('/api/tempPurchaseOrder', require('../routes/tempPurchaseOrder.routes'));
        this.app.use('/api/purchaseOrder', require('../routes/purchaseOrder.routes'));
        this.app.use('/api/staff', require('../routes/staff.routes'));
        this.app.use('/api/product', require('../routes/product.routes'));
        this.app.use('/api/category', require('../routes/category.routes'));
        this.app.use('/api/search', require('../routes/search.routes'));


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