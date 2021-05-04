"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

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
      business_address: DataTypes.STRING,
      verified_status: DataTypes.BOOLEAN,
      ktp_image: {
        type: DataTypes.STRING,
        //Set custom getter for book image using URL
        get() {
          const ktpImage = this.getDataValue("ktp_image");
          return "/images/" + ktpImage;
        },
      },
      bussines_location: DataTypes.JSON,
      business_phone: DataTypes.STRING,
      partner_logo: {
        type: DataTypes.STRING,
        //Set custom getter for book image using URL
        get() {
          const logo = this.getDataValue("partner_logo");
          return "/images/" + logo;
        },
      },
      role: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(val) {
          // setter for encrypt password
          const encryptPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", encryptPassword);
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
