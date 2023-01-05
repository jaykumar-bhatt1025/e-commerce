import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  title: joi.string().trim(true).required(),
  complaintMsg: joi.string().trim(true).min(3).max(500)
    .required(),
  userId: joi.string().trim(true),
});

// eslint-disable-next-line consistent-return
const complaintValidation = async (req, res, next) => {
  const { title, complaintMsg } = req.body;

  const payload = {
    title,
    complaintMsg,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

module.exports = { complaintValidation };
