const { user } = require("../models");
const nodemailer = require("nodemailer");
const fs = require("fs");
const htmlUser = fs.readFileSync(__dirname + "/emailUser/index.html", {
  encoding: "utf-8",
});

class UserController {
  // Get One User
  getOne(req, res, next) {
    user
      .findOne({
        where: { id: req.params.id },
        attributes: [
          "id",
          "name",
          "email",
          "phone_number",
          "city_or_regional",
          "postal_code",
        ],
      })
      .then((data) => {
        if (!data) {
          return next({ message: "User Not Found", statusCode: 404 });
        }

        // If success
        return res.status(200).json({
          message: "Success",
          data: data,
        });
      })
      .catch((err) => {
        return next(e);
      });
  }

  // Get One User
  getUser(req, res, next) {
    user
      .findOne({
        where: { id: req.user.id },
        attributes: [
          "id",
          "name",
          "photo_profile",
          "email",
          "phone_number",
          "city_or_regional",
          "postal_code",
        ],
      })
      .then((data) => {
        if (!data) {
          return next({ message: "User Not Found", statusCode: 404 });
        }

        // If success
        return res.status(200).json({
          message: "Success",
          data: data,
        });
      })
      .catch((e) => {
        return next(e);
      });
  }

  // verify email user
  async verifyEmail(req, res, next) {
    try {
      const { email } = req.body;

      // create reusable transporter object
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL,
        to: `${email}`,
        subject: "Email verification",
        html: htmlUser,
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: `Email has been sent to ${email} please check your email or spam to continue registration`,
      });
    } catch (e) {
      return next(e);
    }
  }

  // Update data user
  async update(req, res, next) {
    let update = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      city_or_regional: req.body.city_or_regional,
      postal_code: req.body.postal_code,
      photo_profile: req.body.photo_profile,
    };

    try {
      let updatedData = await user.update(update, {
        where: {
          id: req.params.id,
        },
      });

      // Find the updated
      let data = await user.findOne({
        where: { id: req.params.id },
        attributes: [
          "name",
          "phone_number",
          "city_or_regional",
          "postal_code",
          "photo_profile",
        ], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Profile udpdated",
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
