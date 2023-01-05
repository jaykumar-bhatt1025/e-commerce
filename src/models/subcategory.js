/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define('SubCategory', {
    subCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_archieved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  // eslint-disable-next-line no-unused-vars
  SubCategory.associate = function (models) {
    SubCategory.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId',
    });
    SubCategory.hasMany(models.Products, {
      foreignKey: 'subCategoryId',
      as: 'subCategory',
    });
  };
  return SubCategory;
};
