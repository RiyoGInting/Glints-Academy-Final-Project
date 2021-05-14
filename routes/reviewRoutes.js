// review routes
const express = require("express");
const router = express.Router();

const reviewValidator = require("../middlewares/validators/reviewValidator");
const reviewController = require("../controllers/reviewController");

router.post("/create", reviewValidator.create, reviewController.create);
router.get("/averageRating/:id", reviewController.averageRating);

module.exports = router;
