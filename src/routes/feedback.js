import express from 'express';

import * as orderController from '../controllers/feedback/feedback.controller';

import feedbackValidation from '../controllers/feedback/feedback.validator';

const { verifyCookie } = require('../middlewares/authorization');


const router = express.Router();

router.post('/', verifyCookie, feedbackValidation, orderController.addFeedback);
router.post('/get', orderController.getFeedback);

module.exports = router;
