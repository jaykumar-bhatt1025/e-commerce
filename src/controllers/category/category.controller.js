import { v4 as uuidv4 } from 'uuid';
import { Category, SubCategory } from '../../models';
import { successResponse, errorResponse, deleteFile } from '../../helpers';
import { upload, deleteFileS3 } from '../../helpers/s3';

const { Op } = require('sequelize');

const getCategory = async (req, res) => {
  try {
    // Details required for pagination
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 12;
    const sortBy = req.query.sortBy || 'categoryName';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    if (req.query.all) {
      const allCategories = await Category.findAndCountAll({
        where: {
          is_archieved: false,
        },
      });
      return successResponse(req, res, allCategories.rows);
    }

    const result = await Category.findAndCountAll({
      where: {
        categoryName: { [Op.iLike]: `%${searchWord}%` },
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

const addCategory = async (req, res) => {
  try {
    const { categoryName, description } = req.body;

    const category1 = await Category.findOne({
      where: { categoryName, is_archieved: true },
    });

    if (category1) {
      try {
        await Category.update(
          { description, is_archieved: false },
          { where: { id: category1.dataValues.id } },
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

    const category = await Category.findOne({
      where: { categoryName, is_archieved: false },
    });

    if (category) {
      return errorResponse(req, res, 'Category already exist');
    }
    const imagePath = await upload(req.file);
    deleteFile(req.file.path);

    const payload = {
      id: uuidv4(),
      categoryName,
      description,
      image: imagePath.Location,
    };
    try {
      await Category.create(payload);
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
    deleteFile(req.file.path);
    return errorResponse(req, res, error.message);
  }
};

// eslint-disable-next-line consistent-return
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    Promise.all([
      Category.findOne({
        where: { id, is_archieved: false },
      }),
      Category.update({ is_archieved: true }, { where: { id } }),
      SubCategory.update({ is_archieved: true }, { where: { categoryId: id } }),
    ])
      .then((result) => {
        if (!result[0]) {
          return errorResponse(req, res, 'Category does not exist');
        }
        return successResponse(req, res, {
          message: 'Data Deleted Successfully',
        });
      })
      // eslint-disable-next-line arrow-parens
      .catch((error) => errorResponse(req, res, error.message));
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

const edit = async (req, res) => {
  try {
    const category1 = await Category.findOne({
      where: { id: req.params.id, is_archieved: false },
    });

    if (!category1) {
      return errorResponse(req, res, 'Category does not exist');
    }

    return successResponse(req, res, { editData: category1.dataValues });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// eslint-disable-next-line consistent-return
const editCategory = async (req, res) => {
  const { id, categoryName, description } = req.body;
  try {
    const category = await Category.findOne({
      where: { categoryName, is_archieved: false },
    });

    if (category && id !== category.dataValues.id) {
      return errorResponse(req, res, 'Category already exist');
    }
    let payload = {
      categoryName,
      description,
    };
    if (req.file) {
      const imagePath = await upload(req.file);
      deleteFile(req.file.path);
      payload = {
        categoryName,
        description,
        image: imagePath.Location,
      };
    }

    Promise.all([
      Category.findOne({
        where: { id, is_archieved: false },
      }),
      Category.update(payload, { where: { id } }),
    ])
      .then(async (result) => {
        if (req.file) {
          const oldUrl = result[0].dataValues.image;
          await deleteFileS3(oldUrl);
          const imagePath = await upload(req.file);
          deleteFile(req.file.path);
          payload = {
            categoryName,
            description,
            image: imagePath.Location,
          };
        }

        return successResponse(req, res, {
          message: 'Data Updated Successfully',
        });
      })
      // eslint-disable-next-line arrow-parens
      .catch((error) => {
        deleteFile(req.file.path);
        return errorResponse(req, res, error.message);
      });
  } catch (error) {
    deleteFile(req.file.path);
    return errorResponse(req, res, error.message);
  }
};

module.exports = {
  getCategory,
  addCategory,
  deleteCategory,
  edit,
  editCategory,
};
