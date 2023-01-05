
/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Complaints = sequelize.define('Complaints', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complaintMsg: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
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
  Complaints.associate = function (models) {
    Complaints.belongsTo(models.Users, {
      as: 'user',
      foreignKey: 'userId',
    });
  };
  return Complaints;
};
