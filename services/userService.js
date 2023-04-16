const UserSignUp = require('../models/userSignUp');

const userService = {
  
  async getUnverifiedUserById(id) {
    const user = await UserSignUp.findOne({
      _id: id,
      verified: false,
    }).exec();
    return user;
  },

  async updateUserPhone(id, phone) {
    const user = await UserSignUp.findOneAndUpdate(
      { _id: id, verified: false },
      { phone },
      { new: true }
    ).exec();
    return user;
  },

  async sendConfirmationCode(phone, code) {
    // Lógica para enviar el código de confirmación por SMS
  },

  generateConfirmationCode() {
    // Lógica para generar un código de confirmación aleatorio
  },
};

module.exports = userService;
