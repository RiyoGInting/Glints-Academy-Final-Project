'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('blogs', [{
      id_user: 1,
      title: 'userTitle',
      article: 'userArticle',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id_user: 2,
      title: 'userTitle2',
      article: 'userArticle2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('blogs', null, {})
  }
};
