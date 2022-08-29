

const {response} = require ('express');
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require ('bcryptjs');
const path = require('path');
const fs   = require('fs');

const UserLogin = require ('../models/user-login');
const authorizedQR = require ('../models/qr.js');
const Pet = require ('../models/pet.js');


const sendOwnerAndPet = async ( codeQR )=>{

    const qrOwner = await UserLogin.findOne({code:codeQR});
    const qrPet = await Pet.findOne({code:codeQR});

    
      if(!idChecked){
          throw new Error (`El id: ${ id } no existe en BD`);
          }

}

module.exports = {
    sendOwnerAndPet
}