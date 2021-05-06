"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_user: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      id_partner: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      appointment_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_item: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_fee: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      order_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      payment_proof: {
        type: Sequelize.STRING,
        allowNull: false,
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

    // Make id_user foreign key
    await queryInterface.addConstraint("transactions", {
      fields: ["id_user"],
      type: "foreign key",
      name: "custom_fkey_id_userTransaction",
      references: {
        //Required field
        table: "users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });

    await queryInterface.addConstraint("transactions", {
      fields: ["id_partner"],
      type: "foreign key",
      name: "custom_fkey_id_partner",
      references: {
        //Required field
        table: "partners",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("transactions");
  },
};
