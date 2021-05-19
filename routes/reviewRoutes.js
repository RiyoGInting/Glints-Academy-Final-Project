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
router.get("/:id", reviewController.getOne);
router.get("/", reviewController.getAll);
router.delete("/:id", reviewController.delete)
module.exports = router;
