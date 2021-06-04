const { review, transaction, user, partner } = require("../models");
const { Op } = require("sequelize");
const { countAvgRating } = require("../helpers/countAvgRating");

class ReviewController {
  async create(req, res, next) {
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

      await countAvgRating(data.transaction.partner.id);

      // If success
      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      next;
    }
  }

  async updateReview(req, res, next) {
    try {
      let updated = {
        rating: req.body.rating,
        review: req.body.review,
      };
      // update review
      let updatedReview = await review.update(updated, {
        where: { id: req.params.id },
      });
      let data = await review.findOne({
        where: { id: req.params.id },
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

      await countAvgRating(data.transaction.partner.id);

      // If success
      return res.status(201).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }

  async deleteReview(req, res, next) {
    try {
      let data = await review.destroy({
        where: { id: req.params.id },
      });

      if (!data) {
        return next({ message: "Data not found", statusCode: 404 });
      }

      let deletedData = await review.findOne({
        where: { id: req.params.id },
        paranoid: false,
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

      await countAvgRating(deletedData.transaction.id_partner);

      return res.status(200).json({
        message: "Success",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error controller",
        error,
      });
    }
  }

  async getOne(req, res, next) {
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
                  "photo_profile",
                ],
              },
              {
                model: partner,
                attributes: [
                  ["id", "partnerID"],
                  ["name", "partnerName"],
                  "partner_logo",
                  "avg_rating",
                ],
              },
            ],
          },
        ],
      });

      if (!data) {
        return next({ message: "Data not found", statusCode: 404 });
      }
      return res.status(200).json({
        message: "Success",
        data,
      });
    } catch (e) {
      return next(e);
    }
  }
  async getAllByUser(req, res, next) {
    try {
      let data = await review.findAll({
        // where: { id: req.params.id }, //req.user.id
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
                  "photo_profile",
                ],
              },
              {
                model: partner,
                attributes: [
                  ["id", "partnerID"],
                  ["name", "partnerName"],
                  "partner_logo",
                  "avg_rating",
                ],
              },
            ],
          },
        ],
      });
      const resultData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].transaction.id_user == req.user.id) {
          resultData.push(data[i]);
        }
      }
      if (resultData.length <= 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        resultData,
      });
    } catch (e) {
      return next(e);
    }
  }
  async getAllByPartner(req, res, next) {
    try {
      let data = await review.findAll({
        // where: { id: req.params.id }, //req.user.id
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
                  "photo_profile",
                ],
              },
              {
                model: partner,
                attributes: [
                  ["id", "partnerID"],
                  ["name", "partnerName"],
                  "partner_logo",
                  "avg_rating",
                ],
              },
            ],
          },
        ],
      });
      const resultData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].transaction.id_partner == req.query.id_partner) {
          resultData.push(data[i]);
        }
      }
      if (resultData.length === 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        resultData,
      });
    } catch (e) {
      return next(e);
    }
  }

  async filterReviewByRating(req, res, next) {
    try {
      let data = await review.findAll({
        // where: { id: req.params.id }, //req.user.id
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
                  "photo_profile",
                ],
              },
              {
                model: partner,
                attributes: [
                  ["id", "partnerID"],
                  ["name", "partnerName"],
                  "partner_logo",
                  "avg_rating",
                ],
              },
            ],
          },
        ],
      });
      const resultData = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].transaction.id_partner == req.query.id_partner) {
          resultData.push(data[i]);
        }
      }
      const filterdata = [];
      for (let i = 0; i < resultData.length; i++) {
        if (resultData[i].rating == req.query.rating) {
          filterdata.push(resultData[i]);
        }
      }

      if (filterdata.length === 0) {
        return res.status(404).json({
          message: "Data not found",
        });
      }
      return res.status(200).json({
        message: "Success",
        filterdata,
      });
    } catch (e) {
      return next(e);
    }
  }
}
module.exports = new ReviewController();
