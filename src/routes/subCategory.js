import express from 'express';
import * as subCategoryController from '../controllers/subCategory/subCategory.controller';

const {
  subCategoryValidation,
} = require('../controllers/subCategory/subCategory.validator');

const router = express.Router();
const { verifyCookie } = require('../middlewares/authorization');
const { isAdminRole } = require('../middlewares/check.roles');


//= ===============================
// sub-category routes
//= ===============================

router.get('/', subCategoryController.getSubCategory);

router.post('/',
  verifyCookie,
  isAdminRole,
  subCategoryValidation,
  subCategoryController.addSubCategory);

router.get('/:id', subCategoryController.edit);

router.put('/',
  verifyCookie,
  isAdminRole,
  subCategoryValidation,
  subCategoryController.editSubCategory);

router.delete('/:id',
  verifyCookie,
  isAdminRole,
  subCategoryController.deleteSubCategory);

module.exports = router;
