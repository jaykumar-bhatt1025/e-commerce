import express from 'express';
import dotenv from 'dotenv';
import * as productController from '../controllers/product/product.controller';
import imageUpload from '../helpers/fileUpload';
import { verifyCookie } from '../middlewares/authorization';
import {
  isAdminRole,
  isSellerRole,
  isAdminSellerRole,
} from '../middlewares/check.roles';

const router = express.Router();

const { productValidation, adminProductValidation } = require('../controllers/product/product.validator');

dotenv.config();

router.post('/', verifyCookie, isSellerRole, imageUpload.array('image', 5), productValidation, productController.addProduct);

router.get('/guest', productController.showProductsGuest);
router.get('/', verifyCookie, productController.showProducts);

router.get('/:id', verifyCookie, isAdminSellerRole, productController.updateProductView);

router.put('/details', verifyCookie, isSellerRole, imageUpload.array('image', 5), productValidation, productController.updateProduct);
router.put('/quantity', verifyCookie, isSellerRole, productController.updateProductQuantity);
router.put('/:action', verifyCookie, isAdminRole, adminProductValidation, productController.adminActionOnProduct);

router.delete('/:id', verifyCookie, isAdminSellerRole, productController.deleteProduct);


module.exports = router;
