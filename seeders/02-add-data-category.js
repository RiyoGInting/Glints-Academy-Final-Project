'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [{
      category_name: 'AC',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      category_name: 'Automotive',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {})
  }
};
