module.exports = (sequelize, DataTypes) => {
  const FeedBacks = sequelize.define('FeedBacks', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    feedbackDesc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderProductId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_archieved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });
  // eslint-disable-next-line func-names
  FeedBacks.associate = function (models) {
    FeedBacks.belongsTo(models.OrderProductMappings, {
      as: 'OrderProducts',
      foreignKey: 'orderProductId',
    });
  };
  return FeedBacks;
};
