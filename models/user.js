"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      role: DataTypes.STRING,
      name: DataTypes.STRING,
      photo_profile: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(val) {
          // setter for encrypt password
          const encryptPassword = bcrypt.hashSync(val, 10);
          this.setDataValue("password", encryptPassword);
        },
      },

      location: DataTypes.JSON,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
      otp_code: DataTypes.INTEGER,
      status_verified: DataTypes.BOOLEAN
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "user",
    }
  );
  return User;
};
