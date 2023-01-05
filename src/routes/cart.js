import express from 'express';

import * as cartController from '../controllers/cart/cart.controller';

import cartValidation from '../controllers/cart/cart.validator';

const { verifyCookie } = require('../middlewares/authorization');

const router = express.Router();

router.post('/', verifyCookie, cartValidation, cartController.addCart);
router.get('/', verifyCookie, cartController.getCart);
router.put('/', verifyCookie, cartController.updateCart);
router.delete('/', verifyCookie, cartController.deleteCart);

module.exports = router;
