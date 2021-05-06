const { partner,category } = require("../../models"); // Import all models
const validator = require("validator");

module.exports.create = async (req, res, next) => {
  try {
    let errors = [];
    // Find Category
    let findCategory = await category.findOne({
      where: {
        id: req.body.id_category,
      },
    });

    // category not found
    if (!findCategory) {
      errors.push("Category Not Found");
    }

    // Check harga is number
    if (!validator.isNumeric(req.body.service_fee)) {
      errors.push("Service Fee must be a number");
    }

    // If errors length > 0, it will make errors message
    if (errors.length > 0) {
      // Because bad request
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    req.body.directory = "partner";

    // It means that will be go to the next middleware
    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: e.message,
    });
  }
};
