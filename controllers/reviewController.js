const { review, transaction, user, partner } = require("../models");

class ReviewController {
  async create(req, res) {
    try {
      
      // create review
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
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      // find partner to count average rating
      let dataPartner = await partner.findAll({
        where: { id: data.transaction.partner.id },
        attributes: ["brand_service_name", "avg_rating"],
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
      // // count average rating
      const transactionData = dataPartner[0].transactions;
      const ratings = [];

      transactionData.forEach((element) => {
        if (element.review != null) {
          ratings.push(element.review.rating);
        }
      });

      const totalData = ratings.length;
      let averageRating;
      if (ratings.length == 0) {
        averageRating = "0";
      } else if (ratings.length > 1) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        const sumRatings = ratings.reduce(reducer) / totalData;
        averageRating = sumRatings.toFixed(1);
      } else if ((ratings.length = 1)) {
        averageRating = ratings[0].toString();
      }

      // update average rating partner
      let averageRatings = parseFloat(averageRating);

      let update = {
        avg_rating: averageRatings,
      };

      let updatedData = await partner.update(update, {
        where: {
          id: data.transaction.partner.id,
        },
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

  async averageRating(req, res) {
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

      // count average rating
      const transactionData = data[0].transactions;
      const ratings = [];

      transactionData.forEach((element) => {
        if (element.review != null) {
          ratings.push(element.review.rating);
        }
      });

      const totalData = ratings.length;
      let averageRating;
      if (ratings.length == 0) {
        averageRating = "0";
      } else if (ratings.length > 1) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        const sumRatings = ratings.reduce(reducer) / totalData;
        averageRating = sumRatings.toFixed(1);
      } else if ((ratings.length = 1)) {
        averageRating = ratings[0].toString();
      }

      // count detail rating
      let detailReview = {
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      };

      ratings.forEach((element) => {
        if (element == 5) {
          detailReview.fiveStar += 1;
        } else if (element == 4) {
          detailReview.fourStar += 1;
        } else if (element == 3) {
          detailReview.threeStar += 1;
        } else if (element == 2) {
          detailReview.twoStar += 1;
        } else if (element == 1) {
          detailReview.oneStar += 1;
        }
      });

      return res.status(200).json({
        message: "Success",
        averageRating,
        detailReview,
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
