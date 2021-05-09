const validator = require("validator");

exports.verifyEmail = async (req, res, next) => {
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

exports.updateUser = async (req, res, next) => {
  try {
    let errors = [];

    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Name can not contain number");
    }

    if (req.body.postal_code && !validator.isNumeric(req.body.postal_code)) {
      errors.push("postal code must be a number");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
    req.body.directory = "user";
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};
