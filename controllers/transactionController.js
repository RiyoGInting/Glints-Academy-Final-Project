const midtransClient = require("midtrans-client");
const { partner, user, category, transaction } = require("../models");

class TransactionController {
  // Create Transaction
  async create(req, res) {
    try {
      let partners = await partner.findOne({
        where: {
          id: req.body.id_partner,
        },
        attributes: ["service_fee"],
      });
      let total = partners.service_fee * req.body.total_item;

      let newData = await transaction.create({
        id_user: 1, //(nanti diganti req.user.id)
        id_partner: req.body.id_partner,
        appointment_date: req.body.appointment_date,
        appointment_hours: req.body.appointment_hours,
        appointment_address: req.body.appointment_address,
        total_item: req.body.total_item,
        total_fee: total,
        order_status: "waiting",
      });

      let data = await transaction.findOne({
        where: {
          id: newData.id,
        },
        include: [
          {
            model: user,
            attributes: [
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
              "location",
            ],
          },
          { model: partner, attributes: ["brand", "business_phone"] },
        ],
      });

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

  // Update Transaction
  async update(req, res) {
    try {
      let partners = await partner.findOne({
        where: {
          id: req.body.id_partner,
        },
        attributes: ["service_fee"],
      });
      let total = partners.service_fee * req.body.total_item;

      let newData = await transaction.update(
        {
          appointment_date: req.body.appointment_date,
          appointment_hours: req.body.appointment_hours,
          appointment_address: req.body.appointment_address,
          total_item: req.body.total_item,
          total_fee: total,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      let data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: user,
            attributes: [
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
              "location",
            ],
          },
          { model: partner, attributes: ["brand", "business_phone"] },
        ],
      });

      if (!data) {
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
}

module.exports = new TransactionController();
