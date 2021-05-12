// review controller
const { review, transaction, user, partner } = require("../models");

class ReviewController {
  async getAll(req, res) {
    try {
      let data = await review.findAll();

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

  // Create Data
  async create(req, res) {
    try {
      let createdData = await review.create({
        id_transaction: req.query.id_transaction,
        rating: req.body.rating,
        review: req.body.review,
      });

      let data = await review.findOne({
        where: { id: createdData.id },
        attributes: ["id", "id_transaction", "rating", "review"],
        include: [
          {
            model: transaction,
            attributes: ["id_user", "id_partner"],
            include: [
              {
                model: user,
                attributes: ["name"],
              },
              {
                model: partner,
                attributes: ["name"],
              },
            ],
          },
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
        error: e,
      });
    }
  }

  async getRating(req, res) {
    try {
      let data = await partner.findAll({
        where: { id: req.params.id },
        attributes: ["brand_service_name"],
        include: [
          {
            model: transaction,
            attributes: ["id"],
            include: [
              {
                model: review,
                attributes: ["rating"],
              },
            ],
          },
        ],
      });

      const transactionData = data[0].transactions;
      const ratings = [];

      transactionData.forEach((element) => ratings.push(element.review.rating));
      const totalData = ratings.length;

      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      const sumRatings = ratings.reduce(reducer) / totalData;
      const averageRating = sumRatings.toFixed(1);
      return res.status(200).json({
        message: "Success",
        averageRating,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: err,
      });
    }
  }
}

module.exports = new ReviewController();
