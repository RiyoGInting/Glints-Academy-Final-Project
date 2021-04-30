"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("services", {
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
      id_patner: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      id_review: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      service_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      service_fee: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avg_rating: {
        type: Sequelize.DECIMAL,
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
    await queryInterface.dropTable("services");
  },
};
