const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getOne);

module.exports = router; // Export router
