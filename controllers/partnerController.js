const { partner, category, Sequelize } = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

class PartnerController {
  async getAll(req, res) {
    try {
      let data = await partner.findAll({
        where: { verified_status: req.query.verified_status },
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  // Get One
  getOnePartner(req, res) {
    partner
      .findOne({
        where: { id: req.partner.id },
        attributes: [
          "id",
          "brand_service_name",
          "email",
          ["phone_number", "owner_phone_number"],
          "business_address",
          "business_phone",
          "partner_logo",
          "avg_rating",
        ], // just these attributes that showed
      })
      .then((data) => {
        // If  not found
        if (!data) {
          return res.status(404).json({
            message: "Partner Not Found",
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

  getOnePartnerProfile(req, res) {
    partner
      .findOne({
        where: { id: req.partner.id },
        attributes: [
          "id",
          "brand_service_name",
          "service_fee",
          "service_description",
        ], // just these attributes that showed
        include: [
          // Include is join
          { model: category, attributes: ["category_name"] },
        ],
      })
      .then((data) => {
        // If  not found
        if (!data) {
          return res.status(404).json({
            message: "Partner Not Found",
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

  // Update data
  async updateVerifiedPartner(req, res) {
    let update = {
      verified_status: req.body.verified_status,
    };
    console.log(update);
    try {
      //  table update data
      let updatedData = await partner.update(update, {
        where: {
          id: req.params.id,
        },
      });

      // Find the updated
      let data = await partner.findOne({
        where: { id: req.params.id },
        attributes: [
          "brand_service_name",
          ["name", "owner_name"],
          "verified_status",
        ], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Status udpdated",
        data,
      });
    } catch (err) {
      // If error
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }

  async updatePhoto(req, res) {
    let update = {
      partner_logo: req.body.partner_logo,
    };
    console.log(update);
    try {
      //  table update data
      let updatedData = await partner.update(update, {
        where: {
          id: req.partner.id,
        },
      });

      // Find the updated
      let data = await partner.findOne({
        where: { id: req.partner.id },
        attributes: ["partner_logo"], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Status udpdated",
        data,
      });
    } catch (err) {
      // If error
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }

  async updateProfileService(req, res) {
    let update = {
      id_category: req.body.id_category,
      brand_service_name: req.body.brand_service_name,
      service_fee: req.body.service_fee,
      service_description: req.body.service_description,
      business_address: req.body.business_address,
      business_phone: req.body.business_phone,
      partner_logo: req.body.partner_logo,
    };

    try {
      //  table update data
      let updatedData = await partner.update(update, {
        where: {
          id: req.partner.id,
        },
      });

      // Find the updated
      let data = await partner.findOne({
        where: { id: req.partner.id },
        attributes: [
          "id",
          "brand_service_name",
          "service_fee",
          "service_description",
          "business_address",
          "business_phone",
          "partner_logo",
        ], // just these attributes that showed
        include: [
          // Include is join
          { model: category, attributes: ["category_name"] },
        ],
      });

      // If success
      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async updateProfile(req, res) {
    let update = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      ktp_address: req.body.ktp_address,
      owner_address: req.body.owner_address,
      partner_logo: req.body.partner_logo,
    };

    try {
      //  table update data
      let updatedData = await partner.update(update, {
        where: {
          id: req.partner.id,
        },
      });

      // Find the updated
      let data = await partner.findOne({
        where: { id: req.partner.id },
        attributes: [
          "id",
          "name",
          "phone_number",
          "ktp_address",
          "owner_address",
          "partner_logo",
        ], // just these attributes that showed
        include: [
          // Include is join
          { model: category, attributes: ["category_name"] },
        ],
      });

      // If success
      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      // If error
      return res.status(500).json({
        message: "Internal Server Error",
        error: e.message,
      });
    }
  }

  async searchByName(req, res) {
    try {
      const { page } = req.query;
      const limits = 12;
      let data = await partner.findAndCountAll({
        where: {
          [Op.and]: [
            {
              brand_service_name: {
                [Sequelize.Op.like]: `%${req.query.brand_service_name}%`,
              },
            },
            {
              verified_status: "verified",
            },
          ],
        },
        limit: limits,
        offset: (parseInt(page) - 1) * limits,
        attributes: [
          "id",
          "partner_logo",
          "brand_service_name",
          "service_fee",
          "business_address",
          "avg_rating",
        ],
      });

      if (data.count == 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        err,
      });
    }
  }

  async searchByFilter(req, res) {
    try {
      const { page } = req.query;
      const limits = 12;
      let data = await partner.findAndCountAll({
        where: {
          [Op.and]: [
            { service_fee: { [Sequelize.Op.gte]: req.body.min_price || 0 } },
            {
              service_fee: {
                [Sequelize.Op.lte]: req.body.max_price || 9999999999,
              },
            },
            {
              business_address: {
                [Sequelize.Op.like]: `%${req.body.business_address}%`,
              },
            },
            {
              verified_status: "verified",
            },
            { avg_rating: { [Sequelize.Op.gte]: req.body.min_rating || 0 } },
            {
              avg_rating: {
                [Sequelize.Op.lte]: req.body.max_rating || 5,
              },
            },
          ],
        },
        limit: limits,
        offset: (parseInt(page) - 1) * limits,
        attributes: [
          "id",
          "partner_logo",
          "brand_service_name",
          "service_fee",
          "business_address",
          "avg_rating",
        ],
      });

      if (data.count == 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        err,
      });
    }
  }

  // verify email partner
  async verifyEmailPartner(req, res) {
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
        text: `Please click on this link to continue your registrations as a partner
        https://tech-stop.herokuapp.com/PartnerFormRegistration`,
      };

      // send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: `Email has been sent to ${email} please check your email or spam to continue registration`,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }
}

module.exports = new PartnerController();
