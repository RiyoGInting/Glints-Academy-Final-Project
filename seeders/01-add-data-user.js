"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        role: "user",
        name: "Abah1",
        email: "user@cobamail.com",
        password: "qwerty",
        phone_number: "081234567890",
        city_or_regional: "medan",
        postal_code: 123123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "user",
        name: "Abah2",
        email: "user2@cobamail.com",
        password: "qwerty",
        phone_number: "081234567891",
        city_or_regional: "medan",
        postal_code: 123123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "user",
        name: "Abah3",
        email: "user3@cobamail.com",
        password: "qwerty",
        phone_number: "081234567892",
        city_or_regional: "medan",
        postal_code: 123123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "user",
        name: "Abah4",
        email: "user3@cobamail.com",
        password: "qwerty",
        phone_number: "081234567892",
        city_or_regional: "medan",
        postal_code: 123123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "user",
        name: "Abah5",
        email: "user3@cobamail.com",
        password: "qwerty",
        phone_number: "081234567892",
        city_or_regional: "medan",
        postal_code: 123123,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
