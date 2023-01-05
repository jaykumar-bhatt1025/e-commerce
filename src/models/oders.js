import { paymentType } from '../constants/constants';

module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.STRING,
      // allowNull: false,
      defaultValue: null,
    },
    paymentType: {
      type: DataTypes.ENUM(paymentType.COD, paymentType.InternetBanking),
      defaultValue: 'COD',
      allowNull: false,
    },
    is_archieved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  // eslint-disable-next-line func-names
  Orders.associate = function (models) {
    Orders.belongsTo(models.Users, {
      as: 'Users',
      foreignKey: 'userId',
    });
    Orders.hasMany(models.OrderProductMappings, {
      as: 'OrderProduct',
      foreignKey: 'orderId',
    });
    Orders.belongsTo(models.Addresses, {
      as: 'Address',
      foreignKey: 'addressId',
    });
  };
  return Orders;
};
