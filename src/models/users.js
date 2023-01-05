import {
  ADMIN, SELLER, USER,
} from '../constants/roles.constants';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        uniqueId: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false,
        uniqueId: true,
      },
      role: {
        type: DataTypes.ENUM(ADMIN, SELLER, USER),
        allowNull: false,
      },
      GSTNo: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isArchived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
  );

  Users.associate = (models) => {
    Users.hasOne(models.UsersOTPs, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Users.hasMany(models.Orders, {
      as: 'Users',
      foreignKey: 'userId',
    });
    Users.hasMany(models.OrderProductMappings, {
      as: 'Sellers',
      foreignKey: 'sellerId',
    });
    Users.hasMany(models.Products, {
      as: 'seller',
      foreignKey: 'sellerId',
    });

    Users.hasMany(models.Complaints, {
      as: 'user',
      foreignKey: 'userId',
    });
    Users.hasMany(models.Addresses, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Users.hasMany(models.ProductOffers, {
      foreignKey: 'userId',
    });
  };
  return Users;
};
