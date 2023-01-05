import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  categoryName: joi.string().trim(true).required(),
  description: joi.string().trim(true).required(),
});

// eslint-disable-next-line consistent-return
const categoryValidation = async (req, res, next) => {
  const { categoryName, description } = req.body;

  const payload = {
    categoryName,
    description,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

module.exports = { categoryValidation };
