'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('reviews', [{
      id_transaction: 1,
      rating: 5,
      review: 'userReview',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id_transaction: 2,
      rating: 5,
      review: 'userReview2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('reviews', null, {})
  }
};
