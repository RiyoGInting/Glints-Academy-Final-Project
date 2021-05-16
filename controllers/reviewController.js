const { review, transaction, partner, user, category } = require("../models");

class ReviewController {
  //get detail review (get one)
  async getOne(req, res) {
    try {
      let data = await review.findOne({
        where: { id: req.params.id },
        attributes: { exclude: ["updatedAt", "deletedAt"] },
        include: [
          {
            model: transaction,
            attributes: ["id_user", "id_partner"],
            include: [
              {
                model: user,
                attributes: [
                  ["id", "userID"],
                  ["name", "userName"],
                ],
              },
              {
                model: partner,
                attributes: [
                  ["id", "partnerID"],
                  ["name", "partnerName"],
                  "avg_rating",
                ],
              },
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
      return res.status(500).json({
        message: "Internal Server Error",
        error,
      });
    }
  }

  async create(req, res) {
    try {
      //cek dulu transaksinya uda success/done atau belum, kalo uda bisa create, kalo belom ga boleh create
      //create review
      let createReview = await review.create(req.body);

      //find partner ID in
      let findPartner = await review.findOne({
        where: { id: createReview.id },
        include: [
          {
            model: transaction,
            attributes: ["id_partner"],
            include: [
              {
                model: partner,
                attributes: [
                  ["id", "partnerID"],
                  ["name", "partnerName"],
                  "avg_rating",
                ],
              },
            ],
          },
        ],
      });

      //find all review by partner ID
      let data = await review.findOneAndCount({
        where: { id: createReview.id },
        include: [
          {
            model: transaction,
            attributes: ["id_partner"],
            include: [
              {
                model: partner,
                where: {
                  id: findPartner.transaction.id_partner
                }
              },
            ],
          },
        ],
      });
      
      //count average rating
      //update average rating on partner

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
module.exports = new ReviewController();
