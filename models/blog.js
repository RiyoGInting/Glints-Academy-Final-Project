"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class blog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  blog.init(
    {
      title: DataTypes.STRING,
      article: DataTypes.STRING,
      publish_date: DataTypes.DATE,
      blog_image: DataTypes.STRING,
    },
    {
      sequelize,
      paranoid: true, // Activate soft delete
      timestamps: true, // timestamps
      modelName: "blog",
    }
  );
  return blog;
};
