"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  service.init(
    {
      service_name: DataTypes.STRING,
      service_fee: DataTypes.DECIMAL,
      description: DataTypes.STRING,
      avgRating: DataTypes.DECIMAL,
    },
    {
      sequelize,
      paranoid: true, // Activate soft delete
      timestamps: true, // timestamps
      modelName: "service",
    }
  );
  return service;
};
