'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Patners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_address: {
        allowNull: false,
        type: Sequelize.STRING
      },
      verified_status: {
        type: Sequelize.BOOLEAN
      },
      ktp_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bussines_location: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      business_phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      partner_logo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Patners');
  }
};