

const User = require ('../models/user');
const Staff = require('../models/staff');
const UserSignUp = require('../models/userSignUp');



const checkUserEmail = async (email) => {

    let emailToCheck = email.split("@");
    const isStaff = emailToCheck[1].includes(process.env.EMAILSTAFF);

    const query = isStaff ? Staff.findOne({ email }) : User.findOne({ email });
    const user = await query.lean();

    if (!user) {
      throw new Error(`El email ${email} no existe`);
    }
    await verifyAccount(user, isStaff);
    
    return user;
}
  

const verifyAccount = async (user, isStaff) => {
 // se trata de un staff
  if (isStaff) {
    if (!user.stateAccount) {
      throw new Error(`La cuenta del staff ${user.email} ha sido eliminada o desactivada`);
    } else if (!user.status) {
      throw new Error(`La cuenta del staff ${user.email} ha sido pausada momentáneamente`);
    }
  } else {
    const userSignUp = await UserSignUp.findOne({ email: user.email });

    if (!userSignUp) {
   
      return null;
    } else if (userSignUp.state === 'UNVERIFIED') {
      throw new Error(`El usuario con el email ${userSignUp.email} necesita verificar su cuenta`);
    } else if (!user.stateAccount) {
      throw new Error(`La cuenta del usuario ${user.email} ha sido eliminada o desactivada`);
    }
  }
};

module.exports=  {checkUserEmail}