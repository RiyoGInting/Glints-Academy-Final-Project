const validator = require("validator");
const { review, partner } = require("../../models");

exports.create = async (req, res, next) => {
  try {
    let errors = [];

    let check = await review.findOne({
      where: { id_transaction: req.query.id_transaction },
    });

    if (check) {
      return res.status(400).json({
        message: "You have reviewed this transaction",
      });
    }

    if (!validator.isNumeric(req.body.rating)) {
      errors.push("Please insert a valid number");
    }

    if (req.body.rating < 0 || req.body.rating > 5) {
      errors.push("Please insert a number between 0 - 5");
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
exports.update = async (req, res, next) => {
  try {
    let errors = [];

    let check = await review.findOne({
      where: { id: req.params.id },
    });

    if (!check) {
      return res.status(404).json({
        message: "Review ID not found",
      });
    }

    if (!validator.isNumeric(req.body.rating)) {
      errors.push("Please insert a valid number");
    }

    if (req.body.rating < 0 || req.body.rating > 5) {
      errors.push("Please insert a number between 0 - 5");
    }
    if (req.body.review.length <= 0) {
      errors.push("Review cannot be empty");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: errors.join(", "),
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};
exports.get = async (req, res, next) => {
  try {
    const check = await partner.findOne({
      where: { id: req.params.id },
    });
    if (!check) {
      return res.status(404).json({
        message: "Partner Not Found",
      });
    }
    next();
  } catch (error) {
    return next(error);
  }
};
