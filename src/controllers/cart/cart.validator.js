import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  productId: joi.required(),
  quantity: joi.number().required(),
});

// eslint-disable-next-line consistent-return
const cartValidation = async (req, res, next) => {
  const { productId, quantity } = req.body;

  const payload = {
    productId,
    quantity,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

export default cartValidation;
