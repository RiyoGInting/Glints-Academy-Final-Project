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
      id_user: DataTypes.INTEGER,
      title: DataTypes.STRING,
      article: DataTypes.TEXT,
      blog_image: {
        type: DataTypes.STRING,
        //Set custom getter for book image using URL
        get() {
          const blog_image = this.getDataValue("blog_image");

          if (!blog_image) {
            return blog_image;
          }

          return `${process.env.S3_URL}/${blog_image}`;
        },
      },
    },
    {
      sequelize,
      paranoid: true,
      timestamps: true,
      modelName: "blog",
    }
  );
  return blog;
};
