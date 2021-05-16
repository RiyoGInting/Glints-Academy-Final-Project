const { category } = require("../models");

class CategoryController {
  // Get all Category
  async getAll(req, res) {
    try {
      let data = await category.findAll();

      if (data.length === 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  async getOne(req, res) {
    try {
      let data = await category.findAll({
        attributes: ["id", "category_name", "description"],
        where: { id: req.params.id },
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  async updateIcon(req, res) {
    let update = {
      category_icon: req.body.category_icon,
    };
    console.log(update);
    try {
      //  table update data
      let updatedData = await category.update(update, {
        where: {
          id: req.params.id,
        },
      });

      // Find the updated
      let data = await category.findOne({
        where: { id: req.params.id },
        attributes: ["category_icon"], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Status udpdated",
        data,
      });
    } catch (err) {
      // If error
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }
}
module.exports = new CategoryController();
