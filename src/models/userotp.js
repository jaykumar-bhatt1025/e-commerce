module.exports = (sequelize, DataTypes) => {
  const UsersOTPs = sequelize.define(
    'UsersOTPs',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      otp: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
  );

  // eslint-disable-next-line no-unused-vars
  UsersOTPs.addHook('afterCreate', async (userOTP, options) => {
    setTimeout(async () => {
      await userOTP.destroy();
    }, 10000 * 60);
  });

  UsersOTPs.associate = (models) => {
    UsersOTPs.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
  };
  return UsersOTPs;
};
