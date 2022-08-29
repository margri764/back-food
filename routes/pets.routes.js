const { Router } = require ('express');
const {check} = require ('express-validator');
const router = Router();

const { signUpPet, getPetById, getOwnPet, petDelete, petUpdate } = require('../controllers/pets.controllers');


router.post('/',[
],signUpPet);

router.get('/:id',[
],getPetById);

router.delete('/:id',[
],petDelete);

router.put('/:id',[
],petUpdate);

module.exports= router;