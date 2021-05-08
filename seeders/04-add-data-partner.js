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
        brand_service_name: "partnerBrand Cuci AC",
        id_category: 1,
        service_fee: 50000,
        verified_status: "verified",
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
        brand_service_name: "partnerBrand2 Service Motor",
        id_category: 2,
        service_fee: 100000,
        verified_status: "verified",
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
