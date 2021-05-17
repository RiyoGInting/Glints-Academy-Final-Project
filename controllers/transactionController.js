const midtransClient = require("midtrans-client");
const { partner, user, category, transaction } = require("../models");

class TransactionController {
  // Get all transaction data (of that user)
  async getAllUser(req, res) {
    try {
      let data = await transaction.findAll({
        where: { id: req.body.id_user },
        // pagination
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "No transactions found",
        });
      }
      // if successful
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

  // Get all transaction data (fof that partner)
  async getAllPartner(req, res) {
    try {
      let data = await transaction.findAll({
        where: { id: req.body.id_partner },
        // pagination
        limit: parseInt(req.query.limit),
        offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit),
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "No transactions found",
        });
      }
      // if successful
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

  // Get One Transaction (User)
  async getOneUser(req, res) {
    try {
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
          {
            model: partner,
            attributes: ["brand_service_name", "business_phone"],
          },
        ],
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "No transaction found",
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

  // Get One Transaction (Partner)
  async getOnePartner(req, res) {
    try {
      let data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: [
          "id_user",
          "id_partner",
          "appointment_date",
          "total_fee",
          "order_status",
          "payment_status",
        ],
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
          {
            model: partner,
            attributes: ["brand_servce_name", "business_phone"],
          },
        ],
      });

      if (data.length === 0) {
        return res.status(404).json({
          message: "No transaction found",
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
          { model: partner, attributes: ["brand_service_name", "business_phone"] },
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
          { model: partner, attributes: ["brand_service_name", "business_phone"] },
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
