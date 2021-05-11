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
}
module.exports = new CategoryController();
