const { user, blog } = require("../../models"); // Import all models
const validator = require("validator"); // Import validator

module.exports.create = async (req, res, next) => {
  try {
    // Initialita
    let errors = [];

    // If image was uploaded
    if (req.files) {
      const file = req.files.blog_image;
      console.log(file);
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
      }}
    // Find user
    let findData = await Promise.all([
      user.findOne({
        where: { id: req.body.id_user },
      }),
    ]);

    // If errors length > 0, it will make errors message
    if (!findData) {
      errors.push("User not found")
    }

    req.body.directory = "blog";
    
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
