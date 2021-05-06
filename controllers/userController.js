const { user } = require("../models");
const nodemailer = require("nodemailer");

class UserController {
  // Get One User
  getOne(req, res) {
    user
      .findOne({
        where: { id: req.params.id },
        attributes: ["id", "name", "email", "phone_number", "address"], // just these attributes that showed
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
        https://techstop.gabatch11.my.id/signup?email=${email}`,
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    res.send(`email has been sent to ${email} please check your email`);
  }

  // Update data user
  async update(req, res) {
    let update = {
      phone_number: req.body.phone_number,
      address: req.body.address,
      password: req.body.password,
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
        attributes: ["phone_number", "address", "password", "otp_code"], // just these attributes that showed
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
