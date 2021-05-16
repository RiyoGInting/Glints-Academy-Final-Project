const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const reviewController = require("../controllers/reviewController");

router.get("/:id", reviewController.getOne);
router.post("/", reviewController.create)

module.exports = router; // Export router
