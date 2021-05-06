const { user, blog } = require("../../models"); // Import all models
const validator = require("validator"); // Import validator

module.exports.create = async (req, res, next) => {
  try {
    // Find user
    let findData = await Promise.all([
      user.findOne({
        where: { id: req.body.id_user },
      }),
    ]);

    // If errors length > 0, it will make errors message
    if (!findData) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // It means that will be go to the next middleware
    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: e,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    // Find user. blog
    let findData = await Promise.all([
      user.findOne({
        where: { id: req.body.id_user },
      }),
      blog.findOne({
        where: { id: req.params.id },
      }),
    ]);

    // Create errors variable
    let errors = [];

    // If user not found
    if (!findData[0]) {
      errors.push("User not found");
    }

    // If transaksi not found
    if (!findData[1]) {
      errors.push("Article not found");
    }

    // If errors length > 0, it will make errors message
    if (errors.length > 0) {
      // Because bad request
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: e,
    });
  }
};
