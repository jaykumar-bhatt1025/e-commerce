import { v4 as uuidv4 } from 'uuid';
import { SubCategory, Category } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

const { Op } = require('sequelize');

const getSubCategory = async (req, res) => {
  try {
    // Details required for pagination
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 12;
    const sortBy = req.query.sortBy || 'subCategoryName';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    if (req.query.all) {
      const allSubCategories = await SubCategory.findAndCountAll({
        where: {
          is_archieved: false,
        },
      });
      return successResponse(req, res, allSubCategories.rows);
    }

    const result = await SubCategory.findAndCountAll({
      include: [{ model: Category, as: 'category' }],
      where: {
        is_archieved: false,
        [Op.or]: [
          { subCategoryName: { [Op.iLike]: `%${searchWord}%` } },
          { '$category.categoryName$': { [Op.iLike]: `%${searchWord}%` } },
        ],
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

const addSubCategory = async (req, res) => {
  try {
    const { subCategoryName, description, categoryId } = req.body;

    const subCategory1 = await SubCategory.findOne({
      where: { subCategoryName, is_archieved: true },
    });

    if (subCategory1) {
      try {
        await SubCategory.update(
          { description, is_archieved: false },
          { where: { id: subCategory1.dataValues.id } },
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

    const subCategory = await SubCategory.findOne({
      where: { subCategoryName, is_archieved: false },
    });

    if (subCategory) {
      return errorResponse(req, res, 'SubCategory already exist');
    }

    const payload = {
      id: uuidv4(),
      subCategoryName,
      description,
      categoryId,
    };
    try {
      await SubCategory.create(payload);
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

const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findOne({
      where: { id, is_archieved: false },
    });

    if (!subCategory) {
      return errorResponse(req, res, 'SubCategory does not exist');
    }

    try {
      await SubCategory.update({ is_archieved: true }, { where: { id } });
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
    const subCategory1 = await SubCategory.findOne({
      where: { id: req.params.id, is_archieved: false },
    });

    if (!subCategory1) {
      return errorResponse(req, res, 'SubCategory does not exist');
    }

    return successResponse(req, res, { editData: subCategory1.dataValues });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const editSubCategory = async (req, res) => {
  // eslint-disable-next-line object-curly-newline
  const { id, subCategoryName, description, categoryId } = req.body;

  try {
    const subCategory = await SubCategory.findOne({
      where: { subCategoryName, is_archieved: false },
    });

    if (subCategory && id !== subCategory.dataValues.id) {
      return errorResponse(req, res, 'Sub Category already exist');
    }

    const payload = {
      subCategoryName,
      description,
      categoryId,
    };

    try {
      await SubCategory.update(payload, { where: { id } });
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
  getSubCategory,
  addSubCategory,
  deleteSubCategory,
  edit,
  editSubCategory,
};
