const express = require('express');
const { upload, uploadUpdateAvatar } = require('../helpers/index');
const { verifyCookie } = require('../middlewares/authorization');

const {
  addUser, getUsers, getSellers, getOneUSer, updateUser, deleteUser, addSeller,
  resendOtp, verifyOTP, loginUser, logOutUser, changePassword, forgotPassword,
} = require('../controllers/users/users.controller');
const {
  userAddValidation, userUpdateValidation, sellerAddValidation, loginValidation,
  passwordValidation, forgotPasswordValidation,
} = require('../controllers/users/users.validator');

const router = express.Router();

router.get('/users', verifyCookie, getUsers);
router.get('/sellers', verifyCookie, getSellers);
router.get('/users/:userId', verifyCookie, getOneUSer);

router.post('/users', upload.single('avatar'), userAddValidation, addUser);
router.post('/sellers', upload.single('avatar'), sellerAddValidation, addSeller);
router.post('/users/resendotp', resendOtp);
router.post('/users/verifyotp', verifyOTP);
router.post('/login', loginValidation, loginUser);
router.post('/logout', verifyCookie, logOutUser);
router.post('/change-password', verifyCookie, passwordValidation, changePassword);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);

router.put('/users/:userId', verifyCookie, uploadUpdateAvatar.single('avatar'), userUpdateValidation, updateUser);

router.delete('/users/:userId', verifyCookie, deleteUser);

module.exports = router;
