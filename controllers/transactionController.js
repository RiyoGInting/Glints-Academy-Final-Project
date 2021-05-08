const midtransClient = require("midtrans-client");
const { partner, user, category, transaction } = require("../models");

class TransactionController {
  // Create Transaction
  async create(req, res) {
    try {
      // find service_fee for total_fee
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

      // show created data
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
      // find service_fee for total_fee
      let partners = await partner.findOne({
        where: {
          id: req.body.id_partner,
        },
        attributes: ["service_fee"],
      });
      let total = partners.service_fee * req.body.total_item;

      // update data
      let newData = await transaction.update(
        {
          id_user: 1, //(nanti diganti req.user.id)
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

  // Cancel Transaction
  async cancelTransaction(req, res) {
    try {
      // update status
      let newData = await transaction.update(
        {
          order_status: "cancelled",
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

  // Accept Transaction
  async acceptTransaction(req, res, next) {
    try {
      // Will create data
      let expired = moment(Date.now() + 2 * 60 * 1000)
        .tz("UTC")
        .format()
        .replace("T", " ")
        .replace("Z", "");

      // update status
      let newData = await transaction.update(
        {
          order_status: "accepted",
          expired_payment: expired,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      if (process.env.NODE_ENV !== "test") {
        // Create Snap API instance
        let snap = new midtransClient.Snap({
          // Set to true if you want Production Environment (accept real transaction).
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
        });

        let userMakeTransaction = await user.findOne({
          where: { id: req.user.id },
        });

        // To define start time
        let now = moment().tz("Asia/Jakarta");
        now = now.format().replace("T", " ").replace("+07:00", " +0700");

        let parameter = {
          transaction_details: {
            order_id: createdData.id,
            gross_amount: req.body.total,
          },
          customer_details: {
            email: userMakeTransaction.email,
            phone: "+621234567890",
          },
          credit_card: {
            secure: true,
          },
          callbacks: {
            finish: "https://techstop.gabatch11.my.id",
          },
          expiry: {
            start_time: now,
            unit: "minutes",
            duration: 2,
          },
        };

        let midtransResponse = await snap.createTransaction(parameter);

        // Update transaksi to create midtrans token and redirect url
        await transaction.update(
          {
            token: midtransResponse.token,
            redirect_url: midtransResponse.redirect_url,
          },
          { where: { 
            id: req.params.id, } }
        );
      }

      // Find the new transaksi
      let data = await transaction.findOne({
        where: { 
          id: req.params.id, },
      });

      // If success
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
