/* eslint-disable import/named */
import express from 'express';
import * as brandController from '../controllers/brand/brand.controller';
import { brandValidation } from '../controllers/brand/brand.validator';

const router = express.Router();
const { verifyCookie } = require('../middlewares/authorization');
const { isAdminRole } = require('../middlewares/check.roles');


//= ===============================
// category routes
//= ===============================

router.get('/', brandController.getBrand);

router.post('/', verifyCookie, isAdminRole, brandValidation, brandController.addBrand);

router.get('/:id', brandController.edit);

router.put('/', verifyCookie, isAdminRole, brandValidation, brandController.editBrand);

router.delete('/:id', verifyCookie, isAdminRole, brandController.deleteBrand);

module.exports = router;
