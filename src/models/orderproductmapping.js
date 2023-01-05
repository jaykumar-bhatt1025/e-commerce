import { trackingStatus } from '../constants/constants';

module.exports = (sequelize, DataTypes) => {
  const OrderProductMappings = sequelize.define('OrderProductMappings', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    trackingStatus: {
      type: DataTypes.ENUM(trackingStatus.Ordered, trackingStatus.Confirmed, trackingStatus.Shipped,
        trackingStatus.OutForDelivery, trackingStatus.Delivered, trackingStatus.Cancel),
      allowNull: false,
      defaultValue: trackingStatus.Ordered,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    is_returned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_archieved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  // eslint-disable-next-line func-names
  OrderProductMappings.associate = function (models) {
    OrderProductMappings.belongsTo(models.Orders, {
      as: 'OrderProduct',
      foreignKey: 'orderId',
    });
    OrderProductMappings.belongsTo(models.Products, {
      as: 'Products',
      foreignKey: 'productId',
    });
    OrderProductMappings.belongsTo(models.Users, {
      as: 'Sellers',
      foreignKey: 'sellerId',
    });
    OrderProductMappings.hasMany(models.FeedBacks, {
      as: 'OrderProducts',
      foreignKey: 'orderProductId',
    });
  };
  return OrderProductMappings;
};
