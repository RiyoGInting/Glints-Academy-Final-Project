const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import auth
const auth = require("../middlewares/auth");

// Import validator
const transactionValidator = require("../middlewares/validators/transactionValidator");

// Import controller
const transactionController = require("../controllers/transactionController");

// Router
router
  .route("/")
  .post(transactionValidator.validator, transactionController.createPayment);
router.post("/pay", transactionController.paymentHandle);
router.put("/status/:id", transactionController.statusUpdate);
router
  .route("/:id")
  .put(transactionValidator.validator, transactionController.update);

module.exports = router; // Export router
