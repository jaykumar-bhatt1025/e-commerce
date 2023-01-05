import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  brandName: joi.string().trim(true).required(),
  description: joi.string().trim(true).required(),
});

// eslint-disable-next-line consistent-return
const brandValidation = async (req, res, next) => {
  const { brandName, description } = req.body;

  const payload = {
    brandName,
    description,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

module.exports = { brandValidation };
