
const Staff = require ('../models/staff');
const UserLogin = require ('../models/user-login')

const checkEmailRegister= async (req, res = response) => {
    
    try {
        const q= req.query.q;

       let user = await UserLogin.findOne({email: q}) || null;
        // || userStaff == null
        if( user == null){
            res.status(200).json([]);

        }else{    

            res.status(200).json({
                success:true,
                msg:"El Usuario ya existe en Base de Datos"
            })
       }
        
    } catch (error) {

        res.status(500).json({
            success:false,
            msg:"Ups! algo salió mal, reintentá mas tarde"
        })
        
    }

}

const checkEmailStaff= async (req, res = response) => {
    
    try {
        const q= req.query.q;

        console.log(q);

       let user = await Staff.findOne({email: q}) || null;

       if( user == null){
            res.status(200).json([]);

        }else{    

            res.status(200).json({
                success:true,
                msg:"El Usuario ya existe en Base de Datos"
            })
       }
        
    } catch (error) {

        res.status(500).json({
            success:false,
            msg:"Ups! algo salió mal, reintentá mas tarde"
        })
        
    }

}


module.exports={
            checkEmailRegister,
            checkEmailStaff
        }