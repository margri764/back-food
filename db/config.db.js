const mongoose = require ('mongoose');
mongoose.set('strictQuery', true);

const dbConnection = async () => {

    try {
        
        await mongoose.connect(process.env.MONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      
        });
        
        console.log('base de datos online');

    } catch (error) {
        console.log(error)
        throw new Error('Error en la db');
   }

}

module.exports = {
    dbConnection
}