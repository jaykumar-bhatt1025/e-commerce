module.exports = (sequelize, DataTypes) => {
  const Addresses = sequelize.define(
    'Addresses',
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
      houseNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      landmark: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pincode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );

  Addresses.associate = (models) => {
    Addresses.belongsTo(models.Users, {
      foreignKey: 'userId',
    });
    Addresses.hasMany(models.Orders, {
      as: 'Address',
      foreignKey: 'addressId',
    });
  };
  return Addresses;
};
