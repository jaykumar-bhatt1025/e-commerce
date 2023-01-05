import { errorResponse } from '../helpers/index';
import * as roles from '../constants/roles.constants';

export const isUserRole = (req, res, next) => {
  if (req.user.role !== roles.USER) {
    return errorResponse(req, res, 'Permission denied !!!', 401);
  }
  return next();
};

export const isSellerRole = (req, res, next) => {
  if (req.user.role !== roles.SELLER) {
    return errorResponse(req, res, 'Permission denied !!!', 401);
  }
  return next();
};

export const isAdminRole = (req, res, next) => {
  if (req.user.role !== roles.ADMIN) {
    return errorResponse(req, res, 'Permission denied !!!', 401);
  }
  return next();
};

export const isAdminSellerRole = (req, res, next) => {
  if (req.user.role === roles.USER) {
    return errorResponse(req, res, 'Permission denied !!!', 401);
  }
  return next();
};

export const isAdminUserRole = (req, res, next) => {
  if (req.user.role === roles.SELLER) {
    return errorResponse(req, res, 'Permission denied !!!', 401);
  }
  return next();
};

export const isAdminSellerUser = (req, res, next) => {
  if (req.user.role !== roles.ADMIN
    || req.user.role !== roles.SELLER
    || req.user.role !== roles.USER) {
    return errorResponse(req, res, 'Permission denied !!!', 401);
  }
  return next();
};
