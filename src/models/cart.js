module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_archieved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  // eslint-disable-next-line func-names
  Cart.associate = function (models) {
    Cart.belongsTo(models.Users, {
      as: 'Users',
      foreignKey: 'userId',
    });
    Cart.belongsTo(models.Products, {
      as: 'Product',
      foreignKey: 'productId',
    });
  };
  return Cart;
};
