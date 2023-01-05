import { verify } from 'jsonwebtoken';
import { Users } from '../models';
import { errorResponse } from '../helpers/index';

export const verifyCookie = async (req, res, next) => {
  try {
    const authorizationToken = req.headers.authorization;
    if (!authorizationToken) {
      return errorResponse(req, res, 'Token not found !!!');
    }
    const verifyToken = authorizationToken.split(' ')[1]; // Returns Verify Token

    // Return Data od user. Here it will return emailID.
    const payload = verify(verifyToken, process.env.verifyToken);
    const matchedEmp = await Users.findOne({
      where: {
        email: payload.email,
        role: payload.role,
        isArchived: false,
      },
      attributes: ['id', 'email', 'role', 'verifyToken'],
    });

    if (!matchedEmp) {
      return errorResponse(req, res, 'Data does not exist !!!', 401);
    }

    // Check if verifyToken matched or not
    if (verifyToken !== matchedEmp.verifyToken) {
      return errorResponse(req, res, 'Please login first !!!', 401);
    }

    // If token matched then send user's data to next route
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    return errorResponse(req, res, 'Something went wrong !!!', 500, error);
  }
};

export const checkAJAX = (req, res, next) => {
  if (req.xhr) {
    return next();
  }
  return res.redirect(301, '/404');
};
