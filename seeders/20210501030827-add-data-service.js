'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('services', [{
      id_category: 1,
      id_patner: 2,
      id_review: 2,
      service_name: 'service AC',
      service_fee: 10000,
      description: 'serviceDescription',
      avg_rating: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id_category: 2,
      id_patner: 1,
      id_review: 1,
      service_name: 'AC service',
      service_fee: 10000,
      description: 'serviceDescription',
      avg_rating: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('services', null, {})
  }
};
