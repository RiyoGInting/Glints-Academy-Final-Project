const midtransClient = require("midtrans-client");
const { partner, user, category, transaction } = require("../models");
const moment = require("moment-timezone");

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
  ///
  async createPayment(req, res) {
    try {
      let createdData = await transaction.findOne({
        where: { id_user: 2 },
      });
      // console.log(createdData);
      let expired = moment(Date.now() + 2 * 60 * 1000);
      req.body.expiredPayment = expired
        .tz("UTC")
        .format()
        .replace("T", " ")
        .replace("Z", " ");

      // console.log(req.body.expiredPayment);
      if (process.env.NODE_ENV !== "test") {
        let snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
        });
        let userMakeTransaction = await user.findOne({
          where: { id: 2 },
        });
        // To define start time
        let now = moment().tz("Asia/Jakarta");
        now = now.format().replace("T", " ").replace("+07:00", " +0700");
        let parameter = {
          transaction_details: {
            order_id: createdData.id + 21,
            gross_amount: createdData.total_fee,
          },
          customer_details: {
            email: userMakeTransaction.email,
            phone: userMakeTransaction.phone_number,
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
            duration: 10,
          },
        };
        let midtransResponse = await snap.createTransaction(parameter);

        await transaction.update(
          {
            token: midtransResponse.token,
            redirect_url: midtransResponse.redirect_url,
            expired_payment: req.body.expiredPayment,
          },
          { where: { id: createdData.id } }
        );
      }
      let data = await transaction.findOne({
        where: {
          id: createdData.id,
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
  //pay with midtrans
  async paymentHandle(req, res) {
    try {
      console.log("xcv");
      let orderId = req.body.order_id;
      let transactionStatus = req.body.transaction_status;
      let fraudStatus = req.body.fraud_status;
      let data;

      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      );

      // Sample transactionStatus handling logic

      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
          // TODO set transaction status on your database to 'challenge'
          // and response with 200 OK
          data = await transaction.update(
            {
              status: "success",
              payment_type:req.body.payment_type,
              expiredPayment: null,
            },
            {
              where: { id: orderId - 21 },
            }
          );
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your database to 'success'
          // and response with 200 OK
          data = await transaction.update(
            {
              status: "success",
              expiredPayment: null,
            },
            {
              where: { id: orderId - 21 },
            }
          );
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        data = await transaction.update(
          {
            status: "success",
            expiredPayment: null,
          },
          {
            where: { id: orderId - 21 },
          }
        );
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "deny" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your database to 'failure'
        // and response with 200 OK
        data = await transaction.update(
          {
            status: "failed",
          },
          {
            where: { id: orderId - 21 },
          }
        );
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your database to 'pending' / waiting payment
        // and response with 200 OK
        data = await transaction.update(
          {
            status: "pending",
          },
          {
            where: { id: orderId - 21 },
          }
        );
      }
      data = await transaction.findOne({
        where: {
          id: orderId - 21,
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
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
  async statusUpdate(req, res) {
    try {

    } catch (error) {}
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
