/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    'Products',
    {
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productImage: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commission: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
        allowNull: false,
      },
      is_archieved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      brandId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
  );
  Products.associate = function (models) {
    // associations can be defined here
    Products.belongsTo(models.SubCategory, {
      as: 'subcategory',
      foreignKey: 'subCategoryId',
    });
    Products.belongsTo(models.Brand, {
      as: 'brand',
      foreignKey: 'brandId',
    });
    Products.belongsTo(models.Users, {
      as: 'seller',
      foreignKey: 'sellerId',
    });
    Products.hasMany(models.OrderProductMappings, {
      as: 'Products',
      foreignKey: 'productId',
    });
    Products.hasMany(models.Cart, {
      as: 'Product',
      foreignKey: 'productId',
    });
  };
  return Products;
};
