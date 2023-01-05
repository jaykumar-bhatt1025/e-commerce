/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_archieved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  // eslint-disable-next-line no-unused-vars
  Brand.associate = function (models) {
    Brand.hasMany(models.Products, {
      as: 'brand',
      foreignKey: 'brandId',
    });
    return Brand;
  };
  return Brand;
};
