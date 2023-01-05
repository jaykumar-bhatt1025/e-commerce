import { errorResponse } from '../../helpers/index';

const joi = require('joi');

const validation = joi.object({
  feedbackDesc: joi.string().trim().required(),
  rating: joi.number().min(1).max(5).required(),
});

// eslint-disable-next-line consistent-return
const feedbackValidation = async (req, res, next) => {
  const { feedbackDesc, rating } = req.body;

  const payload = {
    feedbackDesc,
    rating,
  };

  const { error } = validation.validate(payload);
  if (error) {
    return errorResponse(req, res, error.message, 400);
  }
  next();
};

export default feedbackValidation;
