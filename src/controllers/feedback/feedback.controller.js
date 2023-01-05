
import { v4 } from 'uuid';
import {
  FeedBacks,
  OrderProductMappings,
  Orders,
  Users,
  Products,
} from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const addFeedback = async (req, res) => {
  const userId = req.user.id;
  const { orderProductId, feedbackDesc, rating } = req.body;
  try {
    const data = await OrderProductMappings.findOne({
      include: { model: Orders, as: 'OrderProduct', include: { model: Users, as: 'Users' } },
      where: { id: orderProductId },
    });
    const { trackingStatus } = data.dataValues;
    const uId = data.dataValues.OrderProduct.dataValues.Users.dataValues.id;
    if (!(trackingStatus === 'Delivered' && uId === userId)) {
      return errorResponse(req, res, 'Feedback is allow when your Product is Dellivered.', 500);
    }
    const id = v4();
    const payload = {
      id,
      feedbackDesc,
      rating,
      orderProductId,
    };
    await FeedBacks.create(payload);
    return successResponse(req, res, 'Your Feedback is Added successfully.', 200);
  } catch (error) {
    return errorResponse(req, res, 'Error While adding Feedback.', 500, error.message);
  }
};

export const getFeedback = async (req, res) => {
  const { productId } = req.body;
  try {
    const data = await FeedBacks.findAll({
      include: { model: OrderProductMappings, as: 'OrderProducts', include: { model: Products, as: 'Products' } },
      where: [{ '$OrderProducts.Products.id$': productId }, { is_archieved: false }],
      order: [['rating', 'DESC']],
    });
    return successResponse(req, res, data, 200);
  } catch (error) {
    return errorResponse(req, res, 'Error While fetch Feedback.', 500, error.message);
  }
};
