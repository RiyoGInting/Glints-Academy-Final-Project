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
      id_category: DataTypes.INTEGER,
      service_fee: DataTypes.DECIMAL,
      service_description: DataTypes.TEXT,
      avg_rating: DataTypes.FLOAT,
      brand_service_name: DataTypes.STRING,
      business_address: DataTypes.STRING,
      verified_status: DataTypes.ENUM("not_verified", "verified"),
      ktp_image: {
        type: DataTypes.STRING,
        //Set custom getter for book image using URL
        get() {
          const ktp_image = this.getDataValue("ktp_image");

          if (!ktp_image) {
            return ktp_image;
          }

          return `${process.env.S3_URL}/${ktp_image}`;
        },
      },
      business_location: {
        type: DataTypes.JSON,
        set(value) {
          this.setDataValue("bussines_location", JSON.stringify(value));
        },
      },
      business_phone: DataTypes.STRING,
      partner_logo: {
        type: DataTypes.STRING,
        //Set custom getter for book image using URL
        get() {
          const logo = this.getDataValue("partner_logo");

          if (!logo) {
            return logo;
          }

          return `${process.env.S3_URL}/${logo}`;
        },
      },
      role: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      ktp_address: DataTypes.STRING,
      owner_address: DataTypes.STRING,
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
