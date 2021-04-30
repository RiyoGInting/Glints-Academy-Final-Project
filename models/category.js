"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  category.init(
    {
      category_name: DataTypes.STRING,
      description: DataTypes.STRING,
      category_image: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true, // Activate soft delete
      timestamps: true, // timestamps
      modelName: "category",
    }
  );
  return category;
};
