const midtransClient = require("midtrans-client");
const moment = require("moment-timezone");
const { partner, user, transaction } = require("../models");

class TransactionController {
  // Get all transaction data (of that user)
  async getAllUser(req, res) {
    try {
      let data = await transaction.findAll({
        where: { id_user: req.user.id },
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
        where: { id_partner: req.partner.id },
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
      // find service_fee for total_fee
      let findPartner = await partner.findOne({
        where: {
          id: req.body.id_partner,
        },
        attributes: ["service_fee"],
      });
      let total = findPartner.service_fee * req.body.total_item;

      let newData = await transaction.create({
        id_user: req.user.id,
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
        attributes: [
          "id",
          "createdAt",
          "appointment_date",
          "appointment_address",
          "total_item",
          "total_fee",
          "order_status",
        ],
        include: [
          {
            model: user,
            attributes: [
              ["id", "id_user"],
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
            ],
          },
          {
            model: partner,
            attributes: [
              ["id", "id_partner"],
              "brand_service_name",
              "business_phone",
            ],
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

  // Update Transaction
  async update(req, res) {
    try {
      // find service_fee for total_fee
      let findPartner = await partner.findOne({
        where: {
          id: req.body.id_partner,
        },
        attributes: ["service_fee"],
      });
      let total = findPartner.service_fee * req.body.total_item;

      // update data
      await transaction.update(
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

      // find data
      let data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: [
          "id",
          "createdAt",
          "appointment_date",
          "appointment_address",
          "total_item",
          "total_fee",
          "order_status",
        ],
        include: [
          {
            model: user,
            attributes: [
              ["id", "id_user"],
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
            ],
          },
          {
            model: partner,
            attributes: [
              ["id", "id_partner"],
              "brand_service_name",
              "business_phone",
            ],
          },
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
      await transaction.update(
        {
          order_status: "cancelled",
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // find data
      let data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: [
          "id",
          "createdAt",
          "appointment_date",
          "appointment_address",
          "total_item",
          "total_fee",
          "order_status",
        ],
        include: [
          {
            model: user,
            attributes: [
              ["id", "id_user"],
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
            ],
          },
          {
            model: partner,
            attributes: [
              ["id", "id_partner"],
              "brand_service_name",
              "business_phone",
            ],
          },
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
      // expired time 5 minutes after accepted
      let expiredPayment = moment(Date.now() + 10 * 60 * 1000)
        .tz("UTC")
        .format()
        .replace("T", " ")
        .replace("Z", "");
      console.log(expiredPayment);

      // update status
      await transaction.update(
        {
          order_status: "accepted",
          expired_payment: expiredPayment,
        },
        {
          where: {
            id: req.params.id,
            //id_partner: req.partner.id,
          },
        }
      );

      let findTransaction = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            model: user,
          },
          {
            model: partner,
          },
        ],
      });

      // Make midtrans
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: req.params.id,
          gross_amount: findTransaction.total_fee,
        },
        customer_details: {
          name: findTransaction.user.name,
          email: findTransaction.user.email,
          phone: findTransaction.user.phone_number,
        },
        credit_card: {
          secure: true,
        },
        callbacks: {
          //nanti redirect ke page dari frontend pas transaksi uda success
          finish: "https://techstop.gabatch11.my.id/",
        },
        expiry: {
          //start_time: new Date(Date.now()),
          unit: "minutes",
          duration: 10,
        },
      };

      let midtransResponse = await snap.createTransaction(parameter);

      await transaction.update(
        {
          token: midtransResponse.token,
          redirect_url: midtransResponse.redirect_url,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // Find the updated transaction
      let data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: [
          "id",
          "createdAt",
          "appointment_date",
          "appointment_address",
          "total_item",
          "total_fee",
          "order_status",
          "expired_payment",
          "token",
          "redirect_url",
        ],
        include: [
          {
            model: user,
            attributes: [
              ["id", "id_user"],
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
            ],
          },
          {
            model: partner,
            attributes: [
              ["id", "id_partner"],
              "brand_service_name",
              "business_phone",
            ],
          },
        ],
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

  //handle payment gateway
  async handlePayment(req, res) {
    try {
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
              payment_status: "success",
              order_status: "on process",
              payment_type: req.body.payment_type,
            },
            {
              where: {
                id: orderId,
              },
            }
          );
        } else if (fraudStatus == "accept") {
          // TODO set transaction status on your database to 'success'
          // and response with 200 OK
          data = await transaction.update(
            {
              payment_status: "success",
              order_status: "on process",
              payment_type: req.body.payment_type,
            },
            {
              where: {
                id: orderId,
              },
            }
          );
        }
      } else if (transactionStatus == "settlement") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        data = await transaction.update(
          {
            payment_status: "success",
            order_status: "on process",
            payment_type: req.body.payment_type,
          },
          {
            where: {
              id: orderId,
            },
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
            payment_status: "failed",
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your database to 'pending' / waiting payment
        // and response with 200 OK
        data = await transaction.update(
          {
            payment_status: "pending",
          },
          {
            where: {
              id: orderId,
            },
          }
        );
      }

      // Find the updated transaction
      let updatedData = await transaction.findOne({
        where: {
          id: orderId,
        },
      });

      return res.status(200).json({
        message: "Success",
        updatedData,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  //Transaction Done
  async doneTransaction(req, res) {
    try {
      // update status
      await transaction.update(
        {
          order_status: "done",
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );

      // find data
      let data = await transaction.findOne({
        where: {
          id: req.params.id,
        },
        attributes: [
          "id",
          "createdAt",
          "appointment_date",
          "appointment_address",
          "total_item",
          "total_fee",
          "order_status",
        ],
        include: [
          {
            model: user,
            attributes: [
              ["id", "id_user"],
              "name",
              "phone_number",
              "city_or_regional",
              "postal_code",
            ],
          },
          {
            model: partner,
            attributes: [
              ["id", "id_partner"],
              "brand_service_name",
              "business_phone",
            ],
          },
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
