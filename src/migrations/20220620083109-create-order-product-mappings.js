const { trackingStatus } = require('../constants/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderProductMappings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      orderId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      trackingStatus: {
        allowNull: false,
        type: Sequelize.ENUM(trackingStatus.Ordered, trackingStatus.Confirmed,
          trackingStatus.Shipped, trackingStatus.OutForDelivery, trackingStatus.Delivered,
          trackingStatus.Cancel),
        defaultValue: trackingStatus.Ordered,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      sellerId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      is_returned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_archieved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OrderProductMappings');
  },
};
