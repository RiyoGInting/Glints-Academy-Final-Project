const { partner, category, Sequelize } = require("../models");
const { Op } = require("sequelize");

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
        where: { id: req.params.id },
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
          id: req.params.id,
        },
      });

      // Find the updated 
      let data = await partner.findOne({
        where: { id: req.params.id },
        attributes: [
          "partner_logo"
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
          id: req.params.id,
        },
      });

      // Find the updated 
      let data = await partner.findOne({
        where: { id: req.params.id },
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
          id: req.params.id,
        },
      });

      // Find the updated 
      let data = await partner.findOne({
        where: { id: req.params.id },
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
      const { limit, page } = req.query;
      let data = await partner.findAndCountAll({
        where: {
          brand_service_name: {
            [Sequelize.Op.like]: `%${req.query.brand_service_name}%`,
          },
        },
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        attributes: [
          "id",
          "brand_service_name",
          "service_fee",
          "business_address",
        ],
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
      const { limit, page } = req.query;
      let data = await partner.findAndCountAll({
        where: {
          [Op.and]: [
            { service_fee: req.body.service_fee },
            { business_address: req.body.business_address },
            // { avg_rating: req.body.avg_rating },
          ],
        },
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        attributes: [
          "id",
          "brand_service_name",
          "service_fee",
          "business_address",
        ],
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
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal Server Error",
        err,
      });
    }
  }
}

module.exports = new PartnerController();
