const express = require('express');
const { verifyCookie } = require('../middlewares/authorization');
const {
  getAddress, getOneAddress, addAddress, updateAddress, deleteAddress,
} = require('../controllers/addresses/address.controller');
const { addressValidation, addressUpdateValidation } = require('../controllers/addresses/address.validation');
const { isUserRole } = require('../middlewares/check.roles');

const router = express.Router();

router.get('/address', verifyCookie, isUserRole, getAddress);
router.get('/address/:addressId', verifyCookie, isUserRole, getOneAddress);
router.post('/address', addressValidation, addAddress);
router.put('/address/:addressId', verifyCookie, isUserRole, addressUpdateValidation, updateAddress);
router.delete('/address/:addressId', verifyCookie, isUserRole, deleteAddress);

module.exports = router;
