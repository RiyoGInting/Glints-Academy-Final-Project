"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("partners", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_category: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "partner",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      business_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verified_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ktp_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bussines_location: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      business_phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      partner_logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      service_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      avg_rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("partners");
  },
};
