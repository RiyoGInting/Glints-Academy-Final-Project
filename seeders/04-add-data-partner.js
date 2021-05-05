"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("partners", [
      {
        role: "partner",
        name: "bro",
        email: "userbro@cobamail.com",
        password: "qwerty",
        phone_number: "081234567895",
        brand: "partnerBrand",
        id_category: 1,
        service: "Cuci AC",
        service_fee: 50000,
        verified_status: true,
        business_phone: "123123",
        business_address: "jl. Mangga",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: "partner",
        name: "bro 2",
        email: "userbro2@cobamail.com",
        password: "qwerty",
        phone_number: "081234567899",
        brand: "partnerBrand2",
        id_category: 2,
        service: "Service Motor",
        service_fee: 100000,
        verified_status: true,
        business_phone: "1231232",
        business_address: "jl. Mangga",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("partners", null, {});
  },
};
