const { user } = require("../models");

class UserController {
  // Get One transaksi
  getOne(req, res) {
    user
      .findOne({
        where: { id: req.params.id },
        attributes: ["id", "name", "email", "phone_number", "address"], // just these attributes that showed
      })
      .then((data) => {
        // If transaksi not found
        if (!data) {
          return res.status(404).json({
            message: "User Not Found",
          });
        }

        // If success
        return res.status(200).json({
          message: "Success",
          data: data,
        });
      })
      .catch((e) => {
        // If error
        return res.status(500).json({
          message: "Internal Server Error",
          error: e.message,
        });
      });
  }
}

module.exports = new UserController();
