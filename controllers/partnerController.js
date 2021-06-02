const { partner, category, Sequelize } = require("../models");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const fs = require("fs");
const htmlPartner = fs.readFileSync(__dirname + "/emailPartner/index.html", {
  encoding: "utf-8",
});

class PartnerController {
  async getAll(req, res, next) {
    try {
      let data = await partner.findAll({
        where: { verified_status: req.query.verified_status },
        include: [
          {
            model: category,
            attributes: ["category_name"],
          },
        ],
      });

      if (data.length === 0) {
        return next({ message: "Data not found", statusCode: 404 });
      }

      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (error) {
      return next(e);
    }
  }

  // Get One
  getOnePartner(req, res, next) {
    partner
      .findOne({
        where: { id: req.params.id },
        attributes: [
          "id",
          "brand_service_name",
          "email",
          ["phone_number", "owner_phone_number"],
          "business_address",
          "business_phone",
          "partner_logo",
          "avg_rating",
          "service_description",
          ["service_fee", "price"],
        ],
        include: [
          {
            model: category,
            attributes: [["category_name", "tag_service"]],
          },
        ],
      })
      .then((data) => {
        // If  not found
        if (!data) {
          return next({ message: "Partner Not Found", statusCode: 404 });
        }

        // If success
        return res.status(200).json({
          message: "Success",
          data: data,
        });
      })
      .catch((e) => {
        // If error
        return next(e);
      });
  }

  getOnePartnerProfile(req, res, next) {
    partner
      .findOne({
        where: { id: req.partner.id },

        include: [
          {
            model: category,
            attributes: [["category_name", "tag_service"]],
          },
        ],
      })
      .then((data) => {
        // If  not found
        if (!data) {
          return next({ message: "Partner Not Found", statusCode: 404 });
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

  // Update data
  async updateVerifiedPartner(req, res, next) {
    let update = {
      verified_status: req.body.verified_status,
    };

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
    } catch (e) {
      return next(e);
    }
  }

  async updatePhoto(req, res, next) {
    let update = {
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
        attributes: ["partner_logo"], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Status udpdated",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async updateProfileService(req, res, next) {
    let data = await category.findOne({
      attributes: ["id", "category_name", "description"],
      where: { category_name: req.body.category_name },
    });

    let update = {
      id_category: data.dataValues.id,
      category_name: req.body.category_name,
      brand_service_name: req.body.brand_service_name,
      service_fee: req.body.service_fee,
      service_description: req.body.service_description,
      business_address: req.body.business_address,
      business_phone: req.body.business_phone,
    };

    try {
      //  table update data
      let updatedData = await partner.update(update, {
        where: {
          id: req.partner.id,
        },
      });

      // Find the updated
      let dataUpdate = await partner.findOne({
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
        dataUpdate,
      });
    } catch (e) {
      return next(e);
    }
  }

  async updateProfile(req, res, next) {
    let update = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      ktp_address: req.body.ktp_address,
      owner_address: req.body.owner_address,
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
      return next(e);
    }
  }

  async searchByName(req, res, next) {
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
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async searchByFilter(req, res, next) {
    try {
      const { page } = req.query;
      const limits = 12;
      let data = await partner.findAndCountAll({
        where: {
          [Op.and]: [
            { service_fee: { [Sequelize.Op.gte]: req.query.min_price || 0 } },
            {
              service_fee: {
                [Sequelize.Op.lte]: req.query.max_price || 9999999999,
              },
            },
            {
              business_address: {
                [Sequelize.Op.like]: `%${req.query.business_address}%`,
              },
            },
            {
              verified_status: "verified",
            },
            { avg_rating: { [Sequelize.Op.gte]: req.query.min_rating || 0 } },
            {
              avg_rating: {
                [Sequelize.Op.lte]: req.query.max_rating || 5,
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
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async filterByCategory(req, res, next) {
    try {
      const { page } = req.query;
      const limits = 12;
      let data = await partner.findAndCountAll({
        where: {
          [Op.and]: [
            {
              id_category: req.query.id_category,
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
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  // async filterByRatings(req, res, next) {
  //   try {
  //     const { page } = req.query;
  //     const limits = 12;
  //     let data = await partner.findAndCountAll({
  //       where: {
  //         [Op.and]: [
  //           {
  //             avg_rating: req.query.avg_rating
  //           },
  //           {
  //             verified_status: "verified",
  //           },
  //         ],
  //       },
  //       limit: limits,
  //       offset: (parseInt(page) - 1) * limits,
  //       attributes: [
  //         "id",
  //         "partner_logo",
  //         "brand_service_name",
  //         "service_fee",
  //         "business_address",
  //         "avg_rating",
  //       ],
  //     });

  //     if (data.count == 0) {
  //       return next({ message: "Data not found", statusCode: 404 });
  //     }
  //     return res.status(200).json({
  //       message: "Success",
  //       data,
  //     });
  //   } catch (e) {
  //     return next(e);
  //   }
  // }

  // verify email partner
  async verifyEmailPartner(req, res, next) {
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
        html: htmlPartner,
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
}

module.exports = new PartnerController();
