/* eslint-disable radix */
import { v4 } from 'uuid';
import { Cart, Products } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const addCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const data = await Products.findOne({
      where: { id: productId },
    });
    if (parseInt(quantity) > data.dataValues.quantity) {
      return errorResponse(req, res, 'Product Out of Stock', 500);
    }
    const id = v4();
    const payload = {
      id,
      userId,
      productId,
      quantity,
    };
    await Cart.create(payload);
    return successResponse(req, res, 'Successfully Added into Cart.', 201);
  } catch (error) {
    return errorResponse(req, res, 'Error While Add into Cart.', 500, error.message);
  }
};

export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await Cart.findAll({
      include: { model: Products, as: 'Product', required: true },
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    return successResponse(req, res, result, 200);
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Error While Featching Data.',
      500,
      error.message,
    );
  }
};

export const deleteCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;
  try {
    await Cart.destroy({
      where: [{ userId }, { productId }],
    });
    return successResponse(req, res, 'Product Removed from Cart.', 201);
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Error While Removing Product.',
      500,
      error.message,
    );
  }
};

export const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  try {
    const data = await Products.findOne({
      where: { id: productId },
    });
    if (parseInt(quantity) > data.dataValues.quantity) {
      return errorResponse(req, res, 'Product Out of Stock', 500);
    }
    const payload = {
      quantity,
    };
    await Cart.update(payload, {
      where: [{ userId }, { productId }],
    });
    return successResponse(req, res, 'Quntity Updated Successfully.', 201);
  } catch (error) {
    return errorResponse(
      req,
      res,
      'Error While Updating Quntity.',
      500,
      error.message,
    );
  }
};
