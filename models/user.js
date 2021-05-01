"use strict";
const { Model } = require("sequelize");
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
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        //Set custom setter for password
        set() {
          const encryptPassword = bcrypt.hashSync(password, 10);
          return encryptPassword;
        },
      },
      location: DataTypes.JSON,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
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
