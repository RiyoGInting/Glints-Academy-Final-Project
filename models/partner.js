"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Partner.init(
    {
      brand: DataTypes.STRING,
      business_address: DataTypes.JSON,
      verified_status: DataTypes.BOOLEAN,
      ktp_image: DataTypes.STRING,
      bussines_location: DataTypes.GEOMETRY,
      business_phone: DataTypes.STRING,
      partner_logo: DataTypes.STRING,
      role: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        //Set custom setter for password
        set() {
          const encryptPassword = bcrypt.hashSync(password, 10);
          return encryptPassword;
        },
      },

      phone_number: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,

      modelName: "partner",
    }
  );
  return Partner;
};
