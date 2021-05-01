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
      id_category: DataTypes.INTEGER,
      id_partner: DataTypes.INTEGER,
      id_review: DataTypes.INTEGER,
      service_name: DataTypes.STRING,
      service_fee: DataTypes.DECIMAL,
      description: DataTypes.STRING,
      avg_rating: DataTypes.DECIMAL,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,

      modelName: "service",
    }
  );
  return service;
};
