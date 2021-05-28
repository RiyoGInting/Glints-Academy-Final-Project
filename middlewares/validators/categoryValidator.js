const { partner, category } = require("../../models"); // Import all models
const validator = require("validator");

exports.updateIcon = async (req, res, next) => {
  try {
    // Initialita
    let errors = [];

    // If image was uploaded
    if (req.files) {
      const file = req.files.category_icon;

      // Make sure image is photo
      if (!file.mimetype.startsWith("image")) {
        errors.push("File must be an image");
      }

      // If errors length > 0, it will make errors message
      if (errors.length > 0) {
        // Because bad request
        return res.status(400).json({
          message: errors.join(", "),
        });
      }

      // Check file size (max 1MB)
      if (file.size > 1000000) {
        errors.push("Image must be less than 1MB");
      }

      // If errors length > 0, it will make errors message
      if (errors.length > 0) {
        // Because bad request
        return res.status(400).json({
          message: errors.join(", "),
        });
      }
    }
    req.body.directory = "category";
    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      e,
    });
  }
};
