/* eslint-disable consistent-return */

import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  productName: joi.string().trim(true).min(2).max(40)
    .required(),
  description: joi.string().trim(true).min(3).max(500)
    .required(),
  price: joi.number().integer().required(),
  quantity: joi.number().integer(),
  subCategoryId: joi.string().required(),
  brandId: joi.string().required(),
  is_archieved: joi.boolean().default(false),

});

// eslint-disable-next-line consistent-return
const productValidation = async (req, res, next) => {
  const {
    productName,
    description,
    price,
    quantity,
    subCategoryId,
    brandId,
  } = req.body;

  const payload = {
    productName,
    description,
    price,
    quantity,
    subCategoryId,
    brandId,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

const validationAdminproduct = joi.object({
  commission: joi.number(),
  status: joi.boolean().default(false),

});

const adminProductValidation = async (req, res, next) => {
  const {
    commission,
    status,
  } = req.body;

  const payload = {
    commission,
    status,
  };

  const { error } = validationAdminproduct.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

module.exports = { productValidation, adminProductValidation };
