// review routes
const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

router.get("/", reviewController.getAll);
router.post("/create", reviewController.create);
router.get("/getRating/:id", reviewController.getRating);
// router.get("/averageRating/:id", reviewController.averageRating);

module.exports = router;