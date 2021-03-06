// review routes
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const reviewValidator = require("../middlewares/validators/reviewValidator");
const reviewController = require("../controllers/reviewController");

router.post(
  "/create",
  auth.adminOrUser,
  reviewValidator.create,
  reviewController.create
);

router.put(
  "/update/:id",
  reviewValidator.update,
  reviewController.updateReview
);
router.get(
  "/partner/:id",
  reviewValidator.get,
  reviewController.getAllByPartner
);
router.get("/filter/byRating", reviewController.filterReviewByRating);
router.get("/user", auth.adminOrUser, reviewController.getAllByUser);
router.get("/:id", reviewController.getOne);
router.delete("/:id", reviewController.deleteReview);
module.exports = router;
