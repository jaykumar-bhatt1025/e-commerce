import express from 'express';

import * as orderController from '../controllers/order/order.controller';

import orderValidation from '../controllers/order/order.validator';

const { verifyCookie } = require('../middlewares/authorization');

const router = express.Router();

router.post('/', verifyCookie, orderController.addOrder);
router.get('/', verifyCookie, orderController.getOrder);
router.put('/', verifyCookie, orderValidation, orderController.editOrder);
router.delete('/', verifyCookie, orderController.returnOrder);

module.exports = router;
