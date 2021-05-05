'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      role: "user",
      name: "Abah",
      email: "user@cobamail.com",
      password: "qwerty",
      phone_number: "081234567890",
      address:"jl, mangga",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      role: "user",
      name: "Abah2",
      email: "user2@cobamail.com",
      password: "qwerty",
      phone_number: "081234567891",
      address:"jl, mangga 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      role: "user",
      name: "Abah3",
      email: "user3@cobamail.com",
      password: "qwerty",
      phone_number: "081234567892",
      address:"jl, mangga 3",
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
};
