'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("partners", "ktp_address", {
      allowNull: false,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("partners", "owner_address", {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
