import { Op } from 'sequelize';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Users, UsersOTPs, Addresses } from '../../models';
import {
  USER, SELLER,
} from '../../constants/roles.constants';
import { generateOtpSendMess } from '../../constants/messages';
import { sendMailFunc } from '../../utils/sendMail';

const { v4: uuidv4 } = require('uuid');

const {
  successResponse,
  errorResponse,
  cloudUpload,
  deleteFile,
} = require('../../helpers/index');

const addUserFunc = async (req, res, payload) => {
  // Check if user's data exist or not
  try {
    const user = await Users.findOne({
      where: { email: req.body.email },
      attributes: ['id', 'firstName', 'lastName', 'email', 'contactNo', 'role'],
    });

    if (user) {
      return errorResponse(req, res, `User alrady exist with email ${req.body.email} !!!`, 404);
    }
  } catch (error) {
    return errorResponse(req, res, 'Something went wrong !!!', 500, error);
  }

  // Upload image in S3 bucket
  try {
    await cloudUpload(req.file);
    // console.log('Uploading image to the s3 bucket');
  } catch (error) {
    deleteFile(req.file.path);
    return errorResponse(req, res, 'Profile picture upload Error!', 500, error);
  }

  // Insert Data into Database
  try {
    await Users.create(payload);

    // Send OTP to email
    const otp = Math.floor(Math.random() * 1000000 + 1);
    await UsersOTPs.create({
      id: uuidv4(),
      userId: req.file.filename.split('.')[0],
      otp,
    });
    sendMailFunc(
      req.body.email,
      'Verifiy your email',
      generateOtpSendMess(req.body.firstName, req.body.email, otp),
    );
    return successResponse(
      req,
      res,
      { message: "User's data added successfully...", userId: req.file.filename.split('.')[0] },
      200,
    );
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Error while creating your account !!!',
      500,
      error,
    );
  }
};

const getAllUserSellerFunc = async (req, res, role) => {
  try {
    // Details required for pagination
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 12;
    const sortBy = req.query.sortBy || 'firstName';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    let attr = [];
    if (role === USER) {
      attr = ['password', 'verifyToken', 'GSTNo', 'isVerified', 'isArchived', 'createdAt', 'updatedAt'];
    } else {
      attr = ['password', 'verifyToken', 'isVerified', 'isArchived', 'createdAt', 'updatedAt'];
    }

    // Generate dyamic attributes for USER and SELLER role
    const users = await Users.findAndCountAll({
      where: {
        role,
        isArchived: false,
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${searchWord}%` } },
          { lastName: { [Op.iLike]: `%${searchWord}%` } },
          { email: { [Op.iLike]: `%${searchWord}%` } },
          { contactNo: { [Op.iLike]: `%${searchWord}%` } },
        ],
      },
      attributes: { exclude: attr },
      order: [[`${sortBy}`, `${sortOrder}`]],
      offset: (page - 1) * count,
      limit: count,
    });

    // Adding details required for pagination
    if ((page - 1) * count > 0) {
      users.previous = { page: page - 1 };
    }

    if (page * count < users.count) {
      users.next = { page: page + 1 };
    }

    users.current = { page };
    return successResponse(
      req,
      res,
      {
        data: users.rows,
        current: users.current,
        next: users.next,
        previous: users.previous,
        count: users.count,
      },
      200,
    );
  } catch (error) {
    return errorResponse(
      req,
      res,
      "Error while feching user's data !!!",
      500,
      error,
    );
  }
};

export const addUser = async (req, res) => {
  try {
    const encryptedPassword = await hash(req.body.password, 10);

    const payload = {
      id: req.file.filename.split('.')[0],
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword,
      contactNo: req.body.contactNo,
      avatar: `${process.env.AWS_BUCKET_URL}${req.file.filename}`,
      role: USER,
      isArchived: false,
    };

    return addUserFunc(req, res, payload);
  } catch (error) {
    deleteFile(req.file.path);
    return errorResponse(
      req,
      res,
      'Error while creating your account !!!',
      500,
      error,
    );
  }
};

export const addSeller = async (req, res) => {
  try {
    const encryptedPassword = await hash(req.body.password, 10);

    const payload = {
      id: req.file.filename.split('.')[0],
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: encryptedPassword,
      contactNo: req.body.contactNo,
      avatar: `${process.env.AWS_BUCKET_URL}${req.file.filename}`,
      role: SELLER,
      GSTNo: req.body.GSTNo,
      isArchived: false,
    };

    const matchedGSTNo = await Users.findOne({
      where: { GSTNo: req.body.GSTNo },
    });
    if (matchedGSTNo) {
      return errorResponse(
        req,
        res,
        'GST Number already linked with another account !!!',
        409,
      );
    }

    return addUserFunc(req, res, payload);
  } catch (error) {
    deleteFile(req.file.path);
    return errorResponse(
      req,
      res,
      'Error while creating your account !!!',
      500,
    );
  }
};

export const getUsers = async (req, res) => getAllUserSellerFunc(req, res, USER);
export const getSellers = async (req, res) => getAllUserSellerFunc(req, res, SELLER);

export const getOneUSer = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exist or not
    const matchedUser = await Users.findOne({
      where: { id: userId, isArchived: false },
      attributes: { exclude: ['password', 'verifyToken', 'isVerified', 'isArchived', 'createdAt', 'updatedAt'] },
    });

    if (!matchedUser) {
      return errorResponse(req, res, 'User does not exist !!!', 404);
    }
    return successResponse(req, res, matchedUser, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while fetching data !!!', 500, error);
  }
};

export const updateUser = async (req, res) => {
  let payload;
  const {
    firstName, lastName, contactNo, GSTNo,
  } = req.body;

  // Upload image in S3 bucket
  try {
    payload = {
      firstName,
      lastName,
      contactNo,
      avatar: `${process.env.AWS_BUCKET_URL}${req.file.filename}`,
      isArchived: req.body.isArchived || false,
    };

    if (req.user.role === SELLER) {
      if (!GSTNo) {
        return errorResponse(req, res, 'Enter valid GST number !!!', 400);
      }
      payload.GSTNo = GSTNo;
    }

    // Update image in S3 bucket
    await cloudUpload(req.file);
  } catch (error) {
    deleteFile(req.file.path);
    return errorResponse(req, res, 'Profile picture upload Error!', 500, error);
  }

  // Update data into Database
  try {
    await Users.update(payload, {
      where: { id: req.params.userId },
    });
    return successResponse(req, res, { message: "User's data updated successfully..." }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while updating user\'s data !!!', 500, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if users data exist or not
    const matchedUser = await Users.findOne({
      where: { id: userId, isArchived: false },
    });

    if (!matchedUser) {
      return errorResponse(req, res, 'User does not exist !!!', 404);
    }

    // Soft delete user
    await Users.update({ isArchived: true },
      { where: { id: userId } });

    // Deleta all address of user
    await Addresses.destroy({
      where: { userId },
    });
    return successResponse(req, res, { message: 'User\'s data deleted successfully...' }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }
};

export const resendOtp = async (req, res) => {
  let matchedUser;
  // Check if user exist or not
  try {
    matchedUser = await Users.findOne({
      where: { email: req.body.email, isArchived: false },
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });

    if (!matchedUser) {
      return errorResponse(req, res, 'User does not exist !!!', 404);
    }
  } catch (error) {
    return errorResponse(req, res, 'Error while sending OTP !!!', 500, error);
  }

  // Generate and send new OTP to user
  try {
    const otp = Math.floor(Math.random() * 1000000 + 1);

    await UsersOTPs.destroy({ where: { userId: matchedUser.id } });
    await UsersOTPs.create({ id: uuidv4(), userId: matchedUser.id, otp });

    sendMailFunc(
      matchedUser.email,
      'Verifiy your email',
      generateOtpSendMess(matchedUser.firstName, matchedUser.email, otp),
    );
    return successResponse(
      req,
      res,
      { message: 'OTP sent successfully...' },
      200,
    );
  } catch (error) {
    return errorResponse(req, res, 'Error while sending OTP !!!', 500, error);
  }
};

export const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  let matchedUser;
  // Check if user's data exist or not
  try {
    if (!otp || !email) {
      return errorResponse(req, res, "OTP or email can't be empty !!!", 406);
    }

    matchedUser = await Users.findOne({
      where: { email, isArchived: false },
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });

    if (!matchedUser) {
      return errorResponse(req, res, 'User does not exist !!!', 404);
    }
  } catch (error) {
    return errorResponse(req, res, 'Error while verifying OTP !!!', 500, error);
  }

  // Verify OTP
  try {
    // Check OTP in DB
    const otpDB = await UsersOTPs.findOne({
      where: { userId: matchedUser.id },
      attributes: ['userId', 'otp'],
    });

    if (!otpDB) {
      return errorResponse(req, res, 'Something went wrong !!!', 401);
    }

    // Match OTP
    if (Number(otp) !== otpDB.otp) {
      return errorResponse(req, res, 'Invalid OTP !!!', 401);
    }

    await Users.update({ isVerified: true }, { where: { id: matchedUser.id } });
    return successResponse(
      req,
      res,
      { message: 'Email verified successfully...' },
      200,
    );
  } catch (error) {
    return errorResponse(req, res, 'Error while verifying OTP !!!', 500, error);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let matchedUser;

  // Check if user's data exist or not
  try {
    matchedUser = await Users.findOne({
      where: {
        email,
        isArchived: false,
      },
    });
    if (!matchedUser) {
      return errorResponse(req, res, 'Invalid Credentials !!!', 401);
    }

    if (!matchedUser.isVerified) {
      return errorResponse(
        req,
        res,
        'Please verify your email before login !!!',
        401,
      );
    }

    // Match Password
    const matchedPassword = await compare(password, matchedUser.password);
    if (!matchedPassword) {
      return errorResponse(req, res, 'Invalid Credentials !!!', 401);
    }
  } catch (error) {
    return errorResponse(req, res, 'Error while logging in !!!', 500);
  }

  const user = {
    id: matchedUser.id,
    firstName: matchedUser.firstName,
    lastName: matchedUser.lastName,
    email: matchedUser.email,
    contactNo: matchedUser.contactNo,
    role: matchedUser.role,
    avatar: matchedUser.avatar,
  };

  // Check if token exist then verify and sent it
  // else generate new token and send back to the client

  try {
    // eslint-disable-next-line no-unused-vars
    const payload = verify(matchedUser.verifyToken, process.env.verifyToken);
    return successResponse(req, res, { message: 'User logged in successfully..', verifyToken: matchedUser.verifyToken, user }, 200);
  } catch (error) {
    // If token expired or does not exits then generate new token and send it
    const verifyToken = sign(
      { id: matchedUser.id, email: matchedUser.email, role: matchedUser.role },
      process.env.verifyToken,
      { expiresIn: '1d' },
    );

    matchedUser.verifyToken = verifyToken;
    await matchedUser.save();

    return successResponse(req, res, {
      message: 'User logged in successfully..',
      verifyToken,
      user,
    },
    200);
  }
};

export const logOutUser = async (req, res) => {
  try {
    await Users.update({ verifyToken: '' }, { where: { id: req.user.id } });
    return successResponse(
      req,
      res,
      { message: 'User logged out successfully...' },
      200,
    );
  } catch (error) {
    return errorResponse(req, res, 'Error while logging out !!!', 500, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, newPassword } = req.body;

    if (password === newPassword) {
      return errorResponse(req, res, 'Current password and New password can\'t be same !!!', 406);
    }

    const matchedUser = await Users.findOne({
      where: { id },
      attributes: ['id', 'email', 'password'],
    });

    const passwordFlag = await compare(password, matchedUser.password);
    if (!passwordFlag) {
      return errorResponse(req, res, 'Wrong password !!!', 401);
    }
    matchedUser.password = await hash(newPassword, 10);
    await matchedUser.save();

    return successResponse(req, res, { message: 'Password changed successfully...' }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hash(password, 10);

    await Users.update(
      { password: hashedPassword },
      { where: { email } },
    );

    return successResponse(req, res, { message: 'Password changed successfully...' }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while updating your password !!!', 500, error);
  }
};
