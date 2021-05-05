'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('transactions', [{
      id_user: 1,
      id_partner: 1,
      appointment_date: new Date(),
      total_item: 1,
      total_fee: 50000,
      order_status: 'on procces',
      payment_status: 'paid of',
      payment_type: 'cash',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id_user: 2,
      id_partner: 2,
      appointment_date: new Date(),
      total_item: 1,
      total_fee: 100000,
      order_status: 'on procces',
      payment_status: 'paid of',
      payment_type: 'cash',
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('transactions', null, {})
  }
};
