/* eslint-disable consistent-return */
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import {
  Users, Complaints,
} from '../../models';
import { errorResponse, successResponse } from '../../helpers';
import * as roles from '../../constants/roles.constants';

/* With this API Admin can see all the complaints and
  User can see their complaints. */
export const showComplaints = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const count = Number(req.query.count) || 5;
    const sortBy = req.query.sortBy || 'title';
    const sortOrder = req.query.sortOrder || 'ASC';
    const searchWord = req.query.searchWord || '';

    // for admin display
    if (roles.ADMIN === req.user.role) {
      const result = await Complaints.findAndCountAll({
        include: [{ model: Users, required: true, as: 'user' }],
        where: {
          is_archieved: false,
          [Op.or]: [
            { title: { [Op.iLike]: `%${searchWord}%` } },
            { '$user.firstName$': { [Op.iLike]: `%${searchWord}%` } },
            { '$user.email$': { [Op.iLike]: `%${searchWord}%` } },
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
    }

    // for User display
    if (roles.USER === req.user.role) {
      const result = await Complaints.findAndCountAll({
        include: [{ model: Users, required: true, as: 'user' }],
        where: {
          [Op.and]: [{ is_archieved: false }, { userId: req.user.id }],
          [Op.or]: [
            { title: { [Op.iLike]: `%${searchWord}%` } },
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
    }
  } catch (error) {
    return errorResponse(req, res, `${error.message}`);
  }
};

// With this API User can raise complaint.
export const addComplaint = async (req, res) => {
  const {
    title,
    complaintMsg,
  } = req.body;

  try {
    const payload = {
      id: uuidv4(),
      title,
      complaintMsg,
      userId: req.user.id,
    };

    const add = await Complaints.create(payload);
    if (add) {
      return successResponse(req, res, 'Comaplint raised Successfully.');
    }

    return errorResponse(req, res, 'Complaint not added');
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// With this API Admin and User can delete complaint.
export const deleteComplaint = async (req, res) => {
  try {
    const idd = await Complaints.findOne({
      where: { id: req.params.id },
    });

    if (!idd) {
      return errorResponse(req, res, 'Complaint does not exist');
    }

    await Complaints.update({ is_archieved: true }, { where: { id: req.params.id } });
    return successResponse(req, res, 'Complaint Deleted Successfully');
  } catch (error) {
    return errorResponse(req, res, 'Complaint does not exist');
  }
};
