const validator = require("validator");

class UserValidator {
  async verifyEmail(req, res, next) {
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
  }
}

module.exports = new UserValidator();
