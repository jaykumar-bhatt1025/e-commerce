import { v4 as uuidv4 } from 'uuid';
import { Brand } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

const { Op } = require('sequelize');

const getBrand = async (req, res) => {
  try {
    // Details required for pagination
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 12;
    const sortBy = req.query.sortBy || 'brandName';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    if (req.query.all) {
      const allBrands = await Brand.findAndCountAll({
        where: {
          is_archieved: false,
        },
      });
      return successResponse(req, res, allBrands.rows);
    }

    const result = await Brand.findAndCountAll({
      where: {
        brandName: { [Op.iLike]: `%${searchWord}%` },
        is_archieved: false,
      },
      offset: (page - 1) * count,
      limit: count,
      order: [[`${sortBy}`, `${sortOrder}`]],
    });

    if (page * count < result.count) {
      result.next = {
        page: page + 1,
      };
    }

    if ((page - 1) * count > 0) {
      result.previous = {
        page: page - 1,
      };
    }
    result.current = { page };
    return successResponse(req, res, {
      data: result.rows,
      next: result.next,
      current: result.current,
      previous: result.previous,
      count: result.count,
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const addBrand = async (req, res) => {
  try {
    const { brandName, description } = req.body;

    const brand1 = await Brand.findOne({
      where: { brandName, is_archieved: true },
    });

    if (brand1) {
      try {
        await Brand.update(
          { description, is_archieved: false },
          { where: { id: brand1.dataValues.id } },
        );
        return successResponse(
          req,
          res,
          { message: 'Data Added Successfully' },
          201,
        );
      } catch (error) {
        return errorResponse(req, res, error.message);
      }
    }

    const brand = await Brand.findOne({
      where: { brandName, is_archieved: false },
    });

    if (brand) {
      return errorResponse(req, res, 'Brand already exist');
    }

    const payload = {
      id: uuidv4(),
      brandName,
      description,
    };
    try {
      await Brand.create(payload);
      return successResponse(
        req,
        res,
        { message: 'Data Added Successfully' },
        201,
      );
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const brand = await Brand.findOne({
      where: { id, is_archieved: false },
    });

    if (!brand) {
      return errorResponse(req, res, 'Brand does not exist');
    }

    try {
      await Brand.update({ is_archieved: true }, { where: { id } });
      return successResponse(req, res, {
        message: 'Data Deleted Successfully',
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const edit = async (req, res) => {
  try {
    const brand1 = await Brand.findOne({
      where: { id: req.params.id, is_archieved: false },
    });

    if (!brand1) {
      return errorResponse(req, res, 'Brand does not exist');
    }

    return successResponse(req, res, { editData: brand1.dataValues });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const editBrand = async (req, res) => {
  const { id, brandName, description } = req.body;

  try {
    const brand = await Brand.findOne({
      where: { brandName, is_archieved: false },
    });

    if (brand && id !== brand.dataValues.id) {
      return errorResponse(req, res, 'Brand already exist');
    }

    const payload = {
      brandName,
      description,
    };

    try {
      await Brand.update(payload, { where: { id } });
      return successResponse(req, res, {
        message: 'Data Updated Successfully',
      });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

module.exports = {
  getBrand,
  addBrand,
  deleteBrand,
  edit,
  editBrand,
};
