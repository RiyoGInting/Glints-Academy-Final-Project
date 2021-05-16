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
    const regexPhone = /^[+][6][2]\d{8,11}$/;
    const regexPostal = /^\d{5}$/;

    let errors = [];

    if (req.body.phone_number && !regexPhone.test(req.body.phone_number)) {
      errors.push("Please insert a valid phone number with +62 format");
    }

    if (req.body.postal_code && !regexPostal.test(req.body.postal_code)) {
      errors.push("Please insert a valid postal code");
    }

    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Name can not contain number");
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
