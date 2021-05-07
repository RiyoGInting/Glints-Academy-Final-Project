const validator = require("validator");

class TransactionValidator {
  async validator(req, res, next) {
    try {
      let errors = [];

      if (!validator.isNumeric(req.body.total_item)) {
        errors.push("Total item must be a number");
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

module.exports = new TransactionValidator();
