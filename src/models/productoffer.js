const { offetType } = require('../constants/constants');

module.exports = (sequelize, DataTypes) => {
  const ProductOffers = sequelize.define(
    'ProductOffers',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      offerType: {
        type: DataTypes.ENUM(offetType.INSTANT_DISCOUNT, offetType.CASHBACK),
        allowNull: false,
      },
      maxAllowed: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
  );

  ProductOffers.associate = (models) => {
    ProductOffers.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
    ProductOffers.belongsTo(models.Products, {
      foreignKey: 'productId',
    });
  };
  return ProductOffers;
};
