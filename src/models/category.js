/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
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
  Category.associate = function (models) {
    Category.hasMany(models.SubCategory, {
      as: 'category',
      foreignKey: 'categoryId',
    });
  };
  return Category;
};
