const jwt = require("jsonwebtoken");

class AuthController {
  async getToken(req, res, next) {
    try {
      const body = {
        user: {
          id: req.user.id,
        },
      };

      const token = jwt.sign(body, process.env.JWT_SECRET, {
        expiresIn: "60d",
      });

      return res.status(200).json({
        message: "Success",
        token,
      });
    } catch (e) {
      return next(e);
    }
  }

  async getTokenPartner(req, res) {
    try {
      const body = {
        partner: {
          id: req.partner.id,
        },
      };

      const token = jwt.sign(body, process.env.JWT_SECRET, {
        expiresIn: "60d",
      });

      return res.status(200).json({
        message: "Success",
        token,
      });
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = new AuthController();
