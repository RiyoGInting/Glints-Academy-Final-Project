const { partner, category } = require("../../models"); // Import all models
const validator = require("validator");

exports.updateIcon = async (req, res, next) => {
    try {
      req.body.directory = "category";
      next();
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        e,
      });
    }
  };
  