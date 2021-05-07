const midtransClient = require("midtrans-client");
const {
  partner,
  user,
  category,
  transaction,
  Sequelize,
} = require("../models");

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
        id_user: 5,
        id_partner: req.body.id_partner,
        appointment_date: req.body.appointment_date,
        total_item: req.body.total_item,
        total_fee: total,
        order_status: "waiting",
      });

      let findUser = await user.findOne({ where: { id: req.user.id } });

      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: newData.id,
          gross_amount: newData.total_fee,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: findUser.email,
          phone: findUser.phone_number,
        },
        callbacks: {
          finish: "https://techstop.gabatch11.my.id", //redirect ke detail trx di FE
        },
        expiry: {
          unit: "minutes",
          duration: 10,
        },
      };

      let midtransResponse = await snap.createTransaction(parameter);

      //update transaction to create midtrans token
      await transaction.update(
        {
          token: midtransResponse.token,
          redirect_url: midtransResponse.redirect_url,
        },
        {
          where: {
            id: newData.id,
          },
        }
      );

      let data = await transaction.findOne({
        where: {
          id: newData.id,
        },
        include: [
          { model: user, attributes: ["name"] },
          { model: partner, attributes: ["brand"] },
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

  //handle payment gateway
  async handlePayment(req, res) {
    try {
      let orderId = statusResponse.order_id;
      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;
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
              expiredPayment: null,
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
              expiredPayment: null,
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
            expiredPayment: null,
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

      findne

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
          attributes: ["service_fee"],
        },
      });
      let total = partners.service_fee * req.body.total_item;

      let newData = await transaction.update(
        {
          appointment_date: req.body.appointment_date,
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
          id: newData.id,
        },
        include: [
          { model: user, attributes: ["name"] },
          { model: partner, attributes: ["brand"] },
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

  // Get all Transaction by a User
  async getAllByUser(req, res) {
    try {
      let data = await transaction.findAll({
        where: {
          id: req.user.id,
        },
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
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  // Get one Transaction
  async getOneByUser(req, res) {
    try {
      let data = await transaction.findOne({
        where: {
          id: req.user.id,
          id: req.params.id,
        },
        include: [{ model: category }, { model: user }, { model: partner }],
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
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }
}

module.exports = new TransactionController();
