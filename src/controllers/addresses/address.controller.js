import { Op } from 'sequelize';
import { Addresses, Users } from '../../models';
import { errorResponse, successResponse } from '../../helpers/index';

const { v4: uuidv4 } = require('uuid');

export const getAddress = async (req, res) => {
  try {
    // Details required for pagination
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 6;
    const sortBy = req.query.sortBy || 'houseNo';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    const addresses = await Addresses.findAndCountAll({
      where: {
        userId: req.user.id,
        isArchived: false,
        [Op.or]: [
          { landmark: { [Op.iLike]: `%${searchWord}%` } },
          { city: { [Op.iLike]: `%${searchWord}%` } },
          { state: { [Op.iLike]: `%${searchWord}%` } },
          { country: { [Op.iLike]: `%${searchWord}%` } },
        ],
      },
      order: [[`${sortBy}`, `${sortOrder}`]],
      offset: (page - 1) * count,
      limit: count,
    });

    // Adding details required for pagination
    if ((page - 1) * count > 0) {
      addresses.previous = { page: page - 1 };
    }

    if (page * count < addresses.count) {
      addresses.next = { page: page + 1 };
    }

    addresses.current = { page };
    return successResponse(req, res, {
      data: addresses.rows,
      current: addresses.current,
      next: addresses.next,
      previous: addresses.previous,
      count: addresses.count,
    }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while fetching addresses !!!', 500, error);
  }
};

export const getOneAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Check if addressId exist or not
    const matchedAddress = await Addresses.findOne({
      where: { id: addressId, userId: req.user.id, isArchived: false },
    });

    if (!matchedAddress) {
      return errorResponse(req, res, 'Address does not exist !!!', 404);
    }
    return successResponse(req, res, matchedAddress, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while fetching address !!!', 500, error);
  }
};

export const addAddress = async (req, res) => {
  try {
    const {
      userId, houseNo, landmark, city, state, country, pincode,
    } = req.body;

    // Check if userId exist or not
    const matchedUser = await Users.findOne({
      where: { id: userId },
    });

    if (!matchedUser) {
      return errorResponse(req, res, 'User does not exist !!!', 404);
    }

    const payload = {
      id: uuidv4(),
      userId,
      houseNo,
      landmark,
      city,
      state,
      country,
      pincode,
      isArchived: false,
    };

    const addressObj = await Addresses.create(payload);
    return successResponse(req, res, { message: 'Address added successfully !!!', address: addressObj }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      houseNo, landmark, city, state, country, pincode,
    } = req.body;

    // Check if addressId exist or not
    const matchedAddress = Addresses.findOne({
      where: { id: addressId },
    });

    if (!matchedAddress) {
      return errorResponse(req, res, 'Address does not exist !!!', 404);
    }

    const payload = {
      houseNo,
      landmark,
      city,
      state,
      country,
      pincode,
    };

    const updatedAddress = await Addresses.update(
      payload,
      { where: { id: addressId }, returning: true },
    );

    return successResponse(req, res, { message: 'Address updated successfully...', addres: updatedAddress[1][0] }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while updating address !!!', 500, error);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Check if addressId exist or not
    const matchedAddress = Addresses.findOne({
      where: { id: addressId },
    });

    if (!matchedAddress) {
      return errorResponse(req, res, 'Address does not exist !!!', 404);
    }
    await Addresses.destroy({ where: { id: addressId } });
    return successResponse(req, res, 'Address deleted successfully...', 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while deleting address !!!', 200);
  }
};
