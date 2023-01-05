import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  subCategoryName: joi.string().trim(true).required(),
  description: joi.string().trim(true).required(),
  categoryId: joi.string().trim(true).required(),
});

// eslint-disable-next-line consistent-return
const subCategoryValidation = async (req, res, next) => {
  const { subCategoryName, description, categoryId } = req.body;

  const payload = {
    subCategoryName,
    description,
    categoryId,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

module.exports = { subCategoryValidation };
