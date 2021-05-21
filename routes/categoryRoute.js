const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import controller
const categoryController = require("../controllers/categoryController");
const categoryValidator = require("../middlewares/validators/categoryValidator");
const { uploadIcon } = require("../middlewares/uploads/uploadFlow");

router.get("/", categoryController.getAll);
router.get("/getone/:id", categoryController.getOne);
router.put(
  "/updateIcon/:id",
  categoryValidator.updateIcon,
  uploadIcon,
  categoryController.updateIcon
);
module.exports = router; // Export router
