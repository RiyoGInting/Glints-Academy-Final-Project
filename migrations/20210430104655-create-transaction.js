'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_date: {
        type: Sequelize.DATE
      },
      appointment_date: {
        type: Sequelize.DATE
      },
      total_fee: {
        type: Sequelize.DECIMAL
      },
      order_status: {
        type: Sequelize.STRING
      },
      payment_status: {
        type: Sequelize.STRING
      },
      payment_type: {
        type: Sequelize.STRING
      },
      payment_proof: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};