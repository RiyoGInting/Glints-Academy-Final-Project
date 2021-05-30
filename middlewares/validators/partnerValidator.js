const { partner, category } = require("../../models"); // Import all models
const validator = require("validator");

module.exports.create = async (req, res, next) => {
  try {
    let errors = [];
    // Find Category
    // let findCategory = await category.findOne({
    //   where: {
    //     id: req.body.id_category,
    //   },
    // });

    // // category not found
    // if (!findCategory) {
    //   errors.push("Category Not Found");
    // }

    if (req.files.ktp_image) {
      const file = req.files.ktp_image;

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
    // If image was uploaded
    if (req.files.partner_logo) {
      const file = req.files.partner_logo;

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

module.exports.updateService = async (req, res, next) => {
  try {
    const regexPhoneNumber = /^[+][6][2]\d{8,11}$/;
    let errors = [];

    if (
      req.body.phone_number &&
      !regexPhoneNumber.test(req.body.phone_number)
    ) {
      errors.push("Please insert a valid phone number with +62 format");
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
      message: "Internal Server Error coy",
      error: e.message,
    });
  }
};

module.exports.update = async (req, res, next) => {
  try {
    let errors = [];
    // Find Partner
    // let findPartner = await partner.findOne({
    //   where: {
    //     id: req.params.id,
    //   },
    // });

    // if (!findPartner) {
    //   errors.push("Partner Not Found");
    // }

    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Name can not contain number");
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
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error at validator",
      error: e.message,
    });
  }
};

exports.verifyEmailPartner = async (req, res, next) => {
  try {
    let errors = [];

    if (!validator.isEmail(req.body.email)) {
      errors.push("Please insert a valid email");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

exports.updateLogo = async (req, res, next) => {
  try {
    req.body.directory = "partner";
    next();
  } catch (e) {
    return res.status(500).json({
      message: "Internal Server Error",
      e,
    });
  }
};
