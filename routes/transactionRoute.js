const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import auth
const auth = require("../middlewares/auth");

// Import validator
const transactionValidator = require("../middlewares/validators/transactionValidator");

// Import controller
const transactionController = require("../controllers/transactionController");

// Router
router.route("/handlePayment").post(transactionController.handlePayment);
router.get("/partner/", auth.partner, transactionController.getAllPartner);
router.get("/partner/:id", auth.partner, transactionController.getOnePartner);
router
  .route("/")
  .get(auth.adminOrUser, transactionController.getAllUser)
  .post(
    auth.adminOrUser,
    transactionValidator.validator,
    transactionController.create
  );
router
  .route("/:id")
  .get(auth.adminOrUser, transactionController.getOneUser)
  .put(
    auth.adminOrUser,
    transactionValidator.validator,
    transactionController.update
  );
router.route("/accept/:id").post(transactionController.acceptTransaction);
router.route("/cancel/:id").put(transactionController.cancelTransaction);
router.route("/complete/:id").put(transactionController.completeTransaction);

module.exports = router; // Export router
