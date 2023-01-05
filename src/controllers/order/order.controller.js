/* eslint-disable default-case */
/* eslint-disable no-await-in-loop */
import { v4 } from 'uuid';
import {
  Cart,
  Orders,
  OrderProductMappings,
  Products,
  Users,
  Addresses,
} from '../../models';
import { successResponse, errorResponse } from '../../helpers';
import { sendMailFunc } from '../../utils/sendMail';
import { generateOrderMail } from '../../constants/messages';

// eslint-disable-next-line consistent-return
export const addOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;
    const cart = await Cart.findAll({
      include: [{ model: Products, as: 'Product', required: true },
        { model: Users, as: 'Users', required: true }],
      where: { userId },
    });

    const orderId = v4();
    const orderPayload = {
      id: orderId,
      userId,
      addressId,
    };
    const orderProductPayload = [];

    for (let i = 0; i < cart.length; i += 1) {
      if (cart[i].dataValues.quantity > cart[i].dataValues.Product.quantity) {
        return errorResponse(req, res, 'Product Out Of stock.', 500);
      }
    }
    for (let i = 0; i < cart.length; i += 1) {
      const id = v4();
      const { commission } = cart[i].dataValues.Product;
      const { price } = cart[i].dataValues.Product;
      const newPrice = (commission / 100) * price;
      const orderProduct = {
        id,
        orderId,
        productId: cart[i].dataValues.productId,
        quantity: cart[i].dataValues.quantity,
        sellerId: cart[i].dataValues.Product.sellerId,
        price: price + newPrice,
      };
      orderProductPayload.push(orderProduct);
    }

    for (let i = 0; i < cart.length; i += 1) {
      const productPayload = {
        quantity: cart[i].dataValues.Product.quantity - cart[i].dataValues.quantity,
      };
      await Products.update(productPayload, {
        where: { id: cart[i].dataValues.productId },
      });
    }

    await Orders.create(orderPayload);
    Promise.all([
      OrderProductMappings.bulkCreate(orderProductPayload),
      Cart.destroy({ where: { userId } }),
    ])
      .then(() => successResponse(req, res, 'Your order Placed.', 201))
      .catch(error => errorResponse(req, res, 'Error While Order.', 500, error.message));
  } catch (error) {
    return errorResponse(req, res, 'Error While Order.', 500, error.message);
  }
};

export const getOrder = async (req, res) => {
  try {
    if (req.user.role === 'ADMIN') {
      const data = await OrderProductMappings.findAll({
        include: [{ model: Orders, as: 'OrderProduct', include: { model: Addresses, as: 'Address' } },
          { model: Users, as: 'Sellers' },
          { model: Products, as: 'Products' }],
        order: [['createdAt', 'DESC']],
      });
      return successResponse(req, res, data, 200);
    }
    if (req.user.role === 'SELLER') {
      const data = await OrderProductMappings.findAll({
        include: [{ model: Orders, as: 'OrderProduct', include: { model: Addresses, as: 'Address' } },
          { model: Users, as: 'Sellers' },
          { model: Products, as: 'Products' }],
        where: { sellerId: req.user.id },
        order: [['createdAt', 'DESC']],
      });
      return successResponse(req, res, data, 200);
    }
    const data = await OrderProductMappings.findAll({
      include: [{ model: Orders, as: 'OrderProduct' },
        { model: Users, as: 'Sellers' },
        { model: Products, as: 'Products' }],
      where: { '$OrderProduct.userId$': req.user.id },
      order: [['createdAt', 'DESC']],
    });
    return successResponse(req, res, data, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error While get Order.', 500, error.message);
  }
};

export const editOrder = async (req, res) => {
  const { productId, orderId, trackingStatus } = req.body;
  try {
    const payload = {
      trackingStatus,
    };
    if (trackingStatus === 'Cancel') {
      Promise.all([OrderProductMappings.findOne({ where: [{ productId }, { orderId }] }),
        Products.findOne({ where: { id: productId } })])
        .then(async (data) => {
          const orderQuntity = data[0].dataValues.quantity;
          const productQuantity = data[1].quantity;
          const productPayload = {
            quantity: orderQuntity + productQuantity,
          };
          await Products.update(productPayload, { where: { id: productId } });
        })
        .catch(error => errorResponse(req, res, 'Error While fatch Product data.', 500, error.message));
    }
    await OrderProductMappings.update(payload, {
      where: [{ orderId }, { productId }],
    });
    const data = await OrderProductMappings.findOne({
      include: { model: Orders, as: 'OrderProduct', include: { model: Users, as: 'Users' } },
      where: { orderId },
    });
    const Id = data.dataValues.orderId;
    const { firstName, email } = data.dataValues.OrderProduct.dataValues.Users.dataValues;
    sendMailFunc(email, 'Order Status', generateOrderMail(firstName, trackingStatus, Id));
    return successResponse(req, res, `Order Status is ${trackingStatus}`, 201);
  } catch (error) {
    return errorResponse(req, res, 'Error While Cancel Product.', 500, error.message);
  }
};

export const returnOrder = async (req, res) => {
  const { id } = req.body;
  try {
    const payload = {
      is_returned: true,
    };
    const orderProduct = await OrderProductMappings.findOne({ id });
    const { productId } = orderProduct.dataValues;
    const orderQuantity = orderProduct.dataValues.quantity;
    const product = await Products.findOne({ where: { id: productId } });
    const productPayload = {
      quantity: product.quantity + orderQuantity,
    };
    await Products.update(productPayload, { where: { id: productId } });
    await OrderProductMappings.update(payload, { where: { id } });
    return successResponse(req, res, 'Order Returned successfully.', 200);
  } catch (error) {
    return errorResponse(req, res, 'Error While Return Product.', 500, error.message);
  }
};
