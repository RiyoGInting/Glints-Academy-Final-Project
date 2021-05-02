const validator = require("validator");

class ServiceValidator {
  async validator(req, res, next) {
    try {
      let errors = [];

      if (
        !validator.isAlphanumeric(req.body.service_name, ["en-US"], {
          ignore: " ",
        })
      ) {
        errors.push("Service name must be a valid alpha");
      }
      if (!validator.isNumeric(req.body.service_fee)) {
        errors.push("Service fee must be a number");
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

module.exports = new ServiceValidator();
