const { category } = require("../models");

class CategoryController {
  // Get all Category
  async getAll(req, res, next) {
    try {
      let data = await category.findAll();

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      return next(e);
    }
  }

  async getOne(req, res, next) {
    try {
      let data = await category.findAll({
        attributes: ["id", "category_name", "description"],
        where: { id: req.params.id },
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async updateIcon(req, res, next) {
    let update = {
      category_icon: req.body.category_icon,
    };

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
        message: "Status updated",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }
}
module.exports = new CategoryController();
