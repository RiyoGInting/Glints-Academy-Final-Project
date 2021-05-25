const { partner, transaction, review } = require("../models");

exports.countAvgRating = async (partnerID) => {
  // find partner to count average rating
  let dataPartner = await partner.findAll({
    where: { id: partnerID },
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

  // count average rating
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
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
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
      id: partnerID,
    },
  });
};
