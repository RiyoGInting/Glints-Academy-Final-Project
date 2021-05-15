'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [{
      category_name: 'Air Conditioner (AC)',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      category_name: 'Automotive',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category_name: 'Computer',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      category_name: 'Home Appliance',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      category_name: 'Electronics',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      category_name: 'Tailors',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      category_name: 'Furnitures',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },{
      category_name: 'Plumbing',
      description: 'categoryDescription',
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {})
  }
};
