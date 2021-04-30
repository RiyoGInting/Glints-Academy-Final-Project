"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Patner.init(
    {
      brand: DataTypes.STRING,
      business_address: DataTypes.JSON,
      verified_status: DataTypes.BOOLEAN,
      ktp_image: DataTypes.STRING,
      bussines_location: DataTypes.GEOMETRY,
      business_phone: DataTypes.STRING,
      partner_logo: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,

      modelName: "Patner",
    }
  );
  return Patner;
};
