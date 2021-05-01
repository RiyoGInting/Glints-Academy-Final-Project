"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Patners", [
      {
        id_user: 1,
        brand: "partnerBrand",
        verified_status: true,
        business_phone: "123123",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_user: 2,
        brand: "partnerBrand2",
        verified_status: true,
        business_phone: "1231232",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Patners", null, {});
  },
};
