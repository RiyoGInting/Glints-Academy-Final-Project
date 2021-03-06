const validator = require("validator");
const { user } = require("../../models");

exports.signup = async (req, res, next) => {
  try {
    let find = await user.findOne({ where: { email: req.body.email } });

    if (find) {
      return res.status(400).json({
        message: "email already in use",
      });
    }

    const regexPhoneNumber = /^[+][6][2]\d{8,11}$/;
    const regexPostalCode = /^\d{5}$/;

    let errors = [];

    if (!regexPhoneNumber.test(req.body.phone_number)) {
      errors.push("Please insert a valid phone number with +62 format");
    }

    if (!regexPostalCode.test(req.body.postal_code)) {
      errors.push("Please insert a valid postal code");
    }

    if (!validator.isEmail(req.body.email)) {
      errors.push("Please insert a valid email");
    }

    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Name can not contain number");
    }

    // complete password parameter
    const passValid = ["0", "lower", "upper", "number", "symbol"];
    // password validation
    if (!validator.isStrongPassword(req.body.password)) {
      let result = validator.isStrongPassword(req.body.password, {
        returnScore: true,
        pointsPerUnique: 0,
        pointsPerRepeat: 0,
        pointsForContainingLower: ",lower",
        pointsForContainingUpper: ",upper",
        pointsForContainingNumber: ",number",
        pointsForContainingSymbol: ",symbol",
      });
      // set all return result to array
      result = result.split(",");
      // check what validation is invoked
      const messageFilter = passValid.filter((i) => !result.includes(i));
      if (messageFilter.length > 0) {
        // push the validation message to errors array
        messageFilter.forEach((e) => {
          errors.push(`Password has no ${e} case`);
        });
      } else {
        // trigger happen if password is not 8 character
        errors.push("Password Length is not 8 character");
      }
    }

    if (req.body.confirmPassword !== req.body.password) {
      errors.push("confirmation password must be same as password");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.signupPartner = async (req, res, next) => {
  try {
    let find = await user.findOne({ where: { email: req.body.email } });

    if (find) {
      return res.status(400).json({
        message: "email already in use",
      });
    }

    const regexPhoneNumber = /^[+][6][2]\d{8,11}$/;

    let errors = [];

    if (!regexPhoneNumber.test(req.body.phone_number)) {
      errors.push("Please insert a valid phone number with +62 format");
    }

    if (!validator.isEmail(req.body.email)) {
      errors.push("Please insert a valid email");
    }

    if (!validator.isAlpha(req.body.name, ["en-US"], { ignore: " " })) {
      errors.push("Name can not contain number");
    }

    // complete password parameter
    const passValid = ["0", "lower", "upper", "number", "symbol"];
    // password validation
    if (!validator.isStrongPassword(req.body.password)) {
      let result = validator.isStrongPassword(req.body.password, {
        returnScore: true,
        pointsPerUnique: 0,
        pointsPerRepeat: 0,
        pointsForContainingLower: ",lower",
        pointsForContainingUpper: ",upper",
        pointsForContainingNumber: ",number",
        pointsForContainingSymbol: ",symbol",
      });
      // set all return result to array
      result = result.split(",");
      // check what validation is invoked
      const messageFilter = passValid.filter((i) => !result.includes(i));
      if (messageFilter.length > 0) {
        // push the validation message to errors array
        messageFilter.forEach((e) => {
          errors.push(`Password has no ${e} case`);
        });
      } else {
        // trigger happen if password is not 8 character
        errors.push("Password Length is not 8 character");
      }
    }

    if (req.body.confirmPassword !== req.body.password) {
      errors.push("confirmation password must be same as password");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
