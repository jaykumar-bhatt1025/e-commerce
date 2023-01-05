import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  productId: joi.required(),
  orderId: joi.required(),
  trackingStatus: joi.valid('Confirmed', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancel'),
});

// eslint-disable-next-line consistent-return
const orderValidation = async (req, res, next) => {
  const { productId, orderId, trackingStatus } = req.body;

  const payload = {
    productId,
    orderId,
    trackingStatus,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

export default orderValidation;
