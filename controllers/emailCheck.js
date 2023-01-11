
const Staff = require ('../models/staff');
const User = require ('../models/user')

const checkEmailRegister= async (req, res = response) => {
    
    try {
        const q= req.query.q;

        console.log("desde checkemailregister: ",q);

        let emailToCheck = q.split("@");
  
        
        let user;
        
        if(emailToCheck.includes(process.env.EMAILSTAFF)){
            
            user = await Staff.findOne({email: q}) || null;
        }else{
            user = await User.findOne({email: q}) || null;

       }    
       

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

        // console.log("desde checkemailstaff: ",q);
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