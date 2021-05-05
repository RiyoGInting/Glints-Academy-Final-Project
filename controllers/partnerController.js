const { partner, category } = require("../models");

class PartnerController {

  async getAll(req, res) {
    try {
      let data = await partner.findAll();

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
      console.log(error)
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }
  // Get One transaksi
  getOnePartner(req, res) {
    partner
      .findOne({
        where: { id: req.params.id },
        attributes: [
          "id",
          "brand",
          "email",
          ["phone_number", "owner_phone_number"],
          "business_address",
          "business_phone",
          "partner_logo",
        ], // just these attributes that showed
      })
      .then((data) => {
        // If transaksi not found
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

    try {
      // Transaksi table update data
      let updatedData = await partner.update(update, {
        where: {
          id: req.params.id,
        },
      });

      // Find the updated transaksi
      let data = await user.findOne({
        where: { id: req.params.id },
        attributes: ["brand", "name", "verified_status"], // just these attributes that showed
      });

      // If success
      return res.status(201).json({
        message: "Status udpdated",
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

module.exports = new PartnerController();
