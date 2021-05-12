// review routes
const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

router.post("/create", reviewController.create);
router.get("/averageRating/:id", reviewController.averageRating);


module.exports = router;
