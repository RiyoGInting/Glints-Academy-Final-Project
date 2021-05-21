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
router.get("/averageRating/:id", reviewController.averageRating);
router.put("/update/:id",reviewValidator.update, reviewController.updateReview);
router.get("/user/",auth.adminOrUser, reviewController.getAllByUser);
router.get("/partner/:id", reviewController.getAllByPartner);
router.get("/:id", reviewController.getOne);
router.delete("/:id", reviewController.delete)
module.exports = router;
