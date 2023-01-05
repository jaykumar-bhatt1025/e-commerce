const joi = require('joi');
const { errorResponse } = require('../../helpers/index');

const addressObject = joi.object({
  userId: joi.string().guid({ version: 'uuidv4' }).required(),
  houseNo: joi.number().required(),
  landmark: joi.string().trim(true).required(),
  city: joi.string().trim(true).required(),
  state: joi.string().trim(true).required(),
  country: joi.string().trim(true).required(),
  pincode: joi.string().trim(true).length(6).required(),
});

// eslint-disable-next-line import/prefer-default-export
export const addressValidation = async (req, res, next) => {
  const payload = {
    userId: req.body.userId,
    houseNo: req.body.houseNo,
    landmark: req.body.landmark,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode,
  };

  const { error } = addressObject.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 206, error.details);
  }
  return next();
};

const addressUpdateObject = joi.object({
  houseNo: joi.number().required(),
  landmark: joi.string().trim(true).required(),
  city: joi.string().trim(true).required(),
  state: joi.string().trim(true).required(),
  country: joi.string().trim(true).required(),
  pincode: joi.string().trim(true).length(6).required(),
});

// eslint-disable-next-line import/prefer-default-export
export const addressUpdateValidation = async (req, res, next) => {
  const payload = {
    houseNo: req.body.houseNo,
    landmark: req.body.landmark,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode,
  };

  const { error } = addressUpdateObject.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 206, error.details);
  }
  return next();
};
