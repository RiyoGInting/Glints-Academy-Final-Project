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
      description: DataTypes.TEXT,
      category_icon: {
        type: DataTypes.STRING,
        //Set custom getter for book image using URL
        get() {
          const icon = this.getDataValue("category_icon");

          if (!icon) {
            return icon;
          }

          return `${process.env.S3_URL}/${icon}`;
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,

      modelName: "category",
    }
  );
  return category;
};
