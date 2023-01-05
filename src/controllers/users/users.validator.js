/* eslint-disable import/prefer-default-export */
const joi = require('joi');
const { errorResponse } = require('../../helpers/index');
const { SELLER, USER } = require('../../constants/roles.constants');

const userAddObject = joi.object({
  firstName: joi.string().trim(true).required(),
  lastName: joi.string().trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joi.string().trim(true).min(5).required(),
  contactNo: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
  role: joi.string().trim(true).valid(USER).required(),
});

export const userAddValidation = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    contactNo: req.body.contactNo,
    role: req.body.role,
  };

  const { error } = userAddObject.validate(payload);
  if (!req.file) {
    return errorResponse(req, res, 'please upload profile pic', 406);
  }
  if (error) {
    return errorResponse(req, res, error.message, 206, error.details);
  }
  return next();
};

const sellerAddObject = joi.object({
  firstName: joi.string().trim(true).required(),
  lastName: joi.string().trim(true).required(),
  email: joi.string().email().trim(true).required(),
  password: joi.string().trim(true).min(5).required(),
  contactNo: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
  role: joi.string().trim(true).valid(SELLER).required(),
  GSTNo: joi.string().trim(true).length(15).required(),
});

export const sellerAddValidation = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    contactNo: req.body.contactNo,
    role: req.body.role,
    GSTNo: req.body.GSTNo,
  };

  const { error } = sellerAddObject.validate(payload);
  if (!req.file) {
    return errorResponse(req, res, 'please upload profile pic', 406);
  }
  if (error) {
    return errorResponse(req, res, error.message, 206, error.details);
  }
  return next();
};

const userUpdateObject = joi.object({
  firstName: joi.string().trim(true).required(),
  lastName: joi.string().trim(true).required(),
  contactNo: joi.string().trim(true).required(),
  GSTNo: joi.string().trim(true).length(15),
});

export const userUpdateValidation = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    contactNo: req.body.contactNo,
    GSTNo: req.body.GSTNo,
  };

  const { error } = userUpdateObject.validate(payload);
  if (!req.file) {
    return errorResponse(req, res, 'please upload profile pic', 406);
  }
  if (error) {
    return errorResponse(req, res, error.message, 206, error.details);
  }
  return next();
};

const loginObject = joi.object({
  email: joi.string().email().trim(true).required(),
  password: joi.string().trim(true).min(5).max(18)
    .required(),
});

export const loginValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };
  const { error } = loginObject.validate(payload);
  if (error) {
    return errorResponse(req, res, `Validation Error: ${error.message}`, 406);
  }
  return next();
};

const passwordObject = joi.object({
  password: joi.string().trim(true).min(5).max(18)
    .required(),
  newPassword: joi.string().trim(true).max(5).max(18)
    .required(),
});

export const passwordValidation = async (req, res, next) => {
  const payload = {
    password: req.body.password,
    newPassword: req.body.newPassword,
  };

  const { error } = passwordObject.validate(payload);
  if (error) {
    return errorResponse(req, res, `Validation Error: ${error.message}`, 406);
  }
  return next();
};

const forgotPasswordObject = joi.object({
  email: joi.string().email().trim(true).required(),
  password: joi.string().trim(true).max(5).max(18)
    .required(),
});

export const forgotPasswordValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
    password: req.body.password,
  };

  const { error } = forgotPasswordObject.validate(payload);
  if (error) {
    return errorResponse(req, res, `Validation Error: ${error.message}`, 406);
  }
  return next();
};
