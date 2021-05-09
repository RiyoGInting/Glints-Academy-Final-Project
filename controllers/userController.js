const { user } = require("../models");
const nodemailer = require("nodemailer");

class UserController {
  // Get One User
  getOne(req, res) {
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

  // verify email user
  async verifyEmail(req, res) {
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
        from: "Admin",
        to: `${email}`,
        subject: "email verification",
        text: `Please click on this link to continue your registrations
      https://tech-stop.herokuapp.com/UserFormRegistration`,
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: `Email has been sent to ${email} please check your email`,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }

  // Update data user
  async update(req, res) {
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
        attributes: ["name", "phone_number", "city_or_regional", "postal_code", "photo_profile"], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Profile udpdated",
        data,
      });
    } catch (err) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }
}

module.exports = new UserController();
