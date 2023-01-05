/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
import { v4 as uuidv4, validate } from 'uuid';
import { Op } from 'sequelize';
import dotenv from 'dotenv';
import {
  Products, SubCategory, Brand, Users, Category,
} from '../../models';
import {
  errorResponse, successResponse,
} from '../../helpers';

import * as roles from '../../constants/roles.constants';

const {
  cloudUpload,
} = require('../../helpers/index');


dotenv.config();

// Add product API. Only seller can add product.
export const addProduct = async (req, res) => {
  const {
    productName,
    description,
    price,
    quantity,
    subCategoryId,
    brandId,
  } = req.body;
  // images uploaded on S3 bucket.
  const len = req.files.length;
  for (let i = 0; i < len; i += 1) {
    cloudUpload(req.files[i]);
  }

  // Get images name from local and store it in db.
  const arrImg = [];
  const amzUrl = process.env.AWS_BUCKET_URL;
  req.files.forEach((element) => {
    // eslint-disable-next-line prefer-template
    arrImg.push(amzUrl + element.filename);
  });

  // Payload for add product in db.
  try {
    const payload = {
      id: uuidv4(),
      productName,
      description,
      productImage: arrImg,
      price,
      quantity,
      commission: 5.0,
      is_archieved: false,
      status: false,
      brandId,
      sellerId: req.user.id,
      subCategoryId,
    };

    // It will add payload in db.
    await Products.create(payload);

    // If product successfully added then this response will go.
    return successResponse(req, res,
      { message: 'Product Added Successfully.' }, 200);
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }
};

/* This API show all the products to guest user ,
 also show according to searching and filtering. */
export const showProductsGuest = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 6;
    const sortBy = req.query.sortBy || 'productName';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';
    const categoryId = req.query.categoryId || '';
    const subCategoryId = req.query.subCategoryId || '';
    const brand = req.query.brand || '';
    const brandArr = brand.split(',');


    // Dynamic query for searching and filtering
    const payload = {
      is_archieved: false,
      status: true,
      [Op.or]: [
        { productName: { [Op.iLike]: `%${searchWord}%` } },
        { description: { [Op.iLike]: `%${searchWord}%` } },
        {
          '$subcategory.category.categoryName$':
        { [Op.iLike]: `%${searchWord}%` },
        },
        {
          '$subcategory.category.description$':
        { [Op.iLike]: `%${searchWord}%` },
        },
        {
          '$subcategory.subCategoryName$':
        { [Op.iLike]: `%${searchWord}%` },
        },
        {
          '$subcategory.description$':
        { [Op.iLike]: `%${searchWord}%` },
        },
        { '$brand.brandName$': { [Op.iLike]: `%${searchWord}%` } },
        { '$brand.description$': { [Op.iLike]: `%${searchWord}%` } },
      ],
    };

    const categoryPayload = {
      model: Category,
      as: 'category',
      attributes: { exclude: ['createdAt', 'updatedAt', 'is_archieved'] },
    };
    if (categoryId) {
      categoryPayload.where = { id: categoryId };
    }

    if (subCategoryId) {
      payload.subCategoryId = subCategoryId;
    }

    if (brandArr.length && brandArr[0] !== '') {
      payload.brandId = { [Op.in]: brandArr };
    }

    // Resultant data from products will store in result.
    const result = await Products.findAndCountAll({
      include: [
        {
          model: Brand,
          required: true,
          as: 'brand',
          attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'is_archieved'] },
        },
        {
          model: SubCategory,
          required: true,
          as: 'subcategory',
          include: [categoryPayload],
          attributes: { exclude: ['id', 'categoryId', 'createdAt', 'updatedAt', 'is_archieved'] },
        },
        {
          model: Users, required: true, as: 'seller', attributes: ['firstName', 'lastName', 'email'],
        },
      ],
      where: payload,
      attributes: { exclude: ['is_archieved', 'status', 'createdAt', 'updatedAt'] },
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
    return errorResponse(req, res, `${error.message}`);
  }
};

/* This API is for admin and seller to show products
according to pending and approvel request. */
export const showProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 12;
    const sortBy = req.query.sortBy || 'productName';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';
    const status = (!req.query.status) ? true : (req.query.status === 'true');

    const { role } = req.user;
    let result;

    /* Show all products with pagination and according to
    pending and approvel products to admin. */
    if (role === roles.ADMIN) {
      result = await Products.findAndCountAll({
        include: [
          {
            model: Brand,
            required: true,
            as: 'brand',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'is_archieved'] },
          },
          {
            model: SubCategory,
            required: true,
            as: 'subcategory',
            attributes: { exclude: ['createdAt', 'updatedAt', 'is_archieved'] },
          },
          {
            model: Users,
            required: true,
            as: 'seller',
            attributes: ['firstName', 'lastName', 'email', 'avatar'],
          },
        ],
        where: {
          is_archieved: false,
          status,
          [Op.or]: [
            { productName: { [Op.iLike]: `%${searchWord}%` } },
            { '$subcategory.subCategoryName$': { [Op.iLike]: `%${searchWord}%` } },
            { '$brand.brandName$': { [Op.iLike]: `%${searchWord}%` } },
            { '$seller.firstName$': { [Op.iLike]: `%${searchWord}%` } },
          ],
        },
        attributes: {
          exclude: ['is_archieved', 'status', 'brandId',
            'sellerId', 'subCategoryId', 'createdAt', 'updatedAt'],
        },
        offset: (page - 1) * count,
        limit: count,
        order: [[`${sortBy}`, `${sortOrder}`]],
      });
    }

    /* Show all products with pagination and according to
    pending and approvel products to seller. */
    else {
      result = await Products.findAndCountAll({
        include: [
          {
            model: Brand,
            required: true,
            as: 'brand',
            attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'is_archieved'] },
          },
          {
            model: SubCategory,
            required: true,
            as: 'subcategory',
            attributes: { exclude: ['createdAt', 'updatedAt', 'is_archieved'] },
          },
        ],
        where: {
          status,
          [Op.and]: [{ is_archieved: false }, { sellerId: req.user.id }],
          [Op.or]: [
            { productName: { [Op.iLike]: `%${searchWord}%` } },
            { '$subcategory.subCategoryName$': { [Op.iLike]: `%${searchWord}%` } },
            { '$brand.brandName$': { [Op.iLike]: `%${searchWord}%` } },
          ],
        },
        attributes: {
          exclude: ['commission', 'is_archieved',
            'status', 'brandId', 'sellerId', 'subCategoryId', 'createdAt', 'updatedAt'],
        },
        offset: (page - 1) * count,
        limit: count,
        order: [[`${sortBy}`, `${sortOrder}`]],
      });
    }

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
    return errorResponse(req, res, error.message, 500, error);
  }
};

/* Show one product details filled form according to selection
to seller for updation, And admin can see form to change
commission  and status */
export const updateProductView = async (req, res) => {
  try {
    let attr = [];

    // Check role and exclude field accordingly
    if (req.user.role === roles.ADMIN) {
      attr = ['is_archieved', 'status', 'brandId', 'sellerId',
        'subCategoryId', 'createdAt', 'updatedAt'];
    } else if (req.user.role === roles.SELLER) {
      attr = ['commission', 'is_archieved', 'status', 'brandId',
        'sellerId', 'subCategoryId', 'createdAt', 'updatedAt'];
    }

    const idd = await Products.findOne({
      include: [
        {
          model: Brand,
          required: true,
          as: 'brand',
          attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'is_archieved'] },
        },
        {
          model: SubCategory,
          required: true,
          as: 'subcategory',
          attributes: { exclude: ['createdAt', 'updatedAt', 'is_archieved'] },
        },
        {
          model: Users,
          required: true,
          as: 'seller',
          attributes: ['firstName', 'lastName', 'email', 'avatar'],
        },
      ],
      where: {
        id: req.params.id,
        is_archieved: false,
      },
      attributes: { exclude: attr },
    });

    if (!idd) {
      return errorResponse(req, res, 'Product does not exist !!!', 404);
    }

    return successResponse(req, res, idd, 200);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

/* With this API seller can update his/her product details. */
export const updateProduct = async (req, res) => {
  const {
    id,
    productName,
    description,
    price,
    subCategoryId,
    brandId,
  } = req.body;
  let matchedProduct;

  // Check if product exist or not
  try {
    if (!id) {
      return errorResponse(req, res, 'Invalid projectId !!!', 404);
    }
    matchedProduct = await Products.findOne({ where: { id } });
    if (!matchedProduct) {
      return errorResponse(req, res, 'Product does not exist !!!', 404);
    }
  } catch (error) {
    return errorResponse(req, res, error.message, 500, error);
  }

  // If new images added then it will go in else otherwise go in if.
  if (req.files.length) {
    for (let i = 0; i < req.files.length; i += 1) {
      cloudUpload(req.files[i]);
    }
  }

  let payloadSeller = {};
  if (req.files.length === 0) {
    payloadSeller = {
      productName,
      description,
      subCategoryId,
      price,
      brandId,
      status: false,
    };
  } else {
    const arrImg = [];
    const amzUrl = process.env.AWS_BUCKET_URL;
    req.files.forEach((element) => {
      arrImg.push(amzUrl + element.filename);
    });
    payloadSeller = {
      productName,
      description,
      subCategoryId,
      productImage: arrImg,
      price,
      brandId,
      status: false,
    };
  }
  try {
    await Products.update(payloadSeller, {
      where: {
        id,
      },
    });
    return successResponse(req, res, { message: 'Data Updated Successfully' }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while updating product details !!!', 500);
  }
};

// This API delete product. Only seller and admin can do it.
export const deleteProduct = async (req, res) => {
  try {
    const idd = await Products.findOne({
      where: { id: req.params.id },
    });

    if (!idd) {
      return errorResponse(req, res, 'Product does not exist', 404);
    }

    await Products.update({ is_archieved: true }, { where: { id: req.params.id } });
    return successResponse(req, res, { message: 'Product Deleted Successfully' }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while deleting product details !!!', 500);
  }
};

/* With this API seller can change quantity of his/her product,
It will not go to admin for approverl. */
export const updateProductQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    if (!id || !quantity || Number(quantity) < 0) {
      return errorResponse(req, res, 'Id and quantity must be provided and valid !!!', 404);
    }

    const matchedProduct = await Products.findOne({
      where: { id },
    });

    if (!matchedProduct) {
      return errorResponse(req, res, 'Product does not exist', 404);
    }

    await Products.update({ quantity }, { where: { id } });
    return successResponse(req, res, { message: 'Quantity updating Successfully...' }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while updating product quantity !!!', 500);
  }
};

/* With this API admin can change commission and status
of products. */
export const adminActionOnProduct = async (req, res) => {
  try {
    // Check if product exist or not
    const { id, commission } = req.body;
    if (!id) {
      return errorResponse(req, res, 'Id must be provided and valid !!!', 404);
    }

    const matchedProduct = await Products.findOne({
      where: { id },
    });

    if (!matchedProduct) {
      return errorResponse(req, res, 'Product does not exist', 404);
    }

    let status;
    const payload = {};
    if (req.params.action === 'true' || req.params.action === 'TRUE') {
      status = true;
      if (!req.body.commission) {
        return errorResponse(req, res, 'Commission must be defined', 404);
      }
      payload.commission = commission;
    } else {
      status = false;
    }
    payload.status = status;

    await Products.update(payload, { where: { id } });
    return successResponse(req, res, { message: 'Product updated successfully...' }, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error while updating product details !!!', 500);
  }
};
