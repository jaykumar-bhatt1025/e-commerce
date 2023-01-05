/* eslint-disable no-unused-vars */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      productImage: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      commission: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,

      },
      is_archieved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      brandId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Brands',
          key: 'id',
        },
      },
      sellerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },

      },

      subCategoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'SubCategories',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
