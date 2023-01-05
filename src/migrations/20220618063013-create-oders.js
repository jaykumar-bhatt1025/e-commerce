const { paymentType } = require('../constants/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      addressId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Addresses',
          key: 'id',
        },
      },
      paymentId: {
        // allowNull: false,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      paymentType: {
        allowNull: false,
        type: Sequelize.ENUM(paymentType.COD, paymentType.InternetBanking),
      },
      is_archieved: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Orders');
  },
};
