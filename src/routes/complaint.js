/* eslint-disable max-len */

import express from 'express';
import dotenv from 'dotenv';
import * as complaintController from '../controllers/complaint/complaint.controller';
import { isUserRole, isAdminUserRole } from '../middlewares/check.roles';
import { verifyCookie } from '../middlewares/authorization';

const router = express.Router();

const { complaintValidation } = require('../controllers/complaint/complaint.validator');


//= ===============================
// Product routes
//= ===============================

dotenv.config();

router.post('/', verifyCookie, isUserRole, complaintValidation, complaintController.addComplaint);

router.get('/', verifyCookie, complaintController.showComplaints);

router.delete('/:id', verifyCookie, isAdminUserRole, complaintController.deleteComplaint);

module.exports = router;
