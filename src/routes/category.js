/* eslint-disable import/named */
import express from 'express';
import * as categoryController from '../controllers/category/category.controller';
import { categoryValidation } from '../controllers/category/category.validator';
import imageUpload from '../helpers/fileUpload';

const router = express.Router();
const { verifyCookie } = require('../middlewares/authorization');
const { isAdminRole } = require('../middlewares/check.roles');


//= ===============================
// category routes
//= ===============================

router.get('/', categoryController.getCategory);

router.post(
  '/',
  verifyCookie,
  isAdminRole,
  imageUpload.single('imagePath'),
  categoryValidation,
  categoryController.addCategory,
);

router.get('/:id', categoryController.edit);

router.put(
  '/',
  verifyCookie,
  isAdminRole,
  imageUpload.single('imagePath'),
  categoryValidation,
  categoryController.editCategory,
);

router.delete('/:id', verifyCookie, isAdminRole, categoryController.deleteCategory);

module.exports = router;
