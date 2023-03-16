

const User = require ('../models/user');
const Staff = require('../models/staff');
const UserSignUp = require('../models/userSignUp');


const checkUserEmail = async (email) => {
    let emailToCheck = email.split("@");
    let user = null;
  
    if (emailToCheck[1].includes(process.env.EMAILSTAFF)) {
      user = await Staff.findOne({ email }) || null;
  
      if (user == null) {
        throw new Error("Staff no encontrado en BD");
      } else if (!user.stateAccount) {
        throw new Error("Staff eliminado o inactivo en BD");
      }
     } else {
      const userLogin = await UserSignUp.findOne({ email }) || null;  
      if(userLogin  == null) {
        throw new Error('Usuario sin cuenta')
      }else if(userLogin.state === "UNVERIFIED") {
        throw new Error('Usuario en proceso de verificacion, revise su Email')
      }
      console.log(email);
      user = await User.findOne({ email }) || null;
      console.log(user);
      if (user == null) {
        throw new Error("Usuario no encontrado en BD");
      } else if (!user.stateAccount) {
        throw new Error("Usuario eliminado o inactivo en BD");
      }

   
    }
    return user;
  };
  

module.exports=  {checkUserEmail}