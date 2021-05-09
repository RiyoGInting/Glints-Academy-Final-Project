const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import auth
const auth = require("../middlewares/auth");

// Import validator
const transactionValidator = require("../middlewares/validators/transactionValidator");

// Import controller
const transactionController = require("../controllers/transactionController");

// Router
// Get All & Get One for Users 
router.get("/", auth.adminOrUser, transactionController.getAll);
router.get("/:id", auth.adminOrUser, transactionController.getOne);

// Get All & Get One for Partners
router.get("/", auth.partner, transactionController.getAll);
router.get("/:id", auth.partner, transactionController.getOne);

router
  .route("/accept/:id")
  .post(auth.partner, transactionController.acceptTransaction);
router
  .route("/handlePayment")
  .post(transactionController.handlePayment);
router
  .route("/")
  .post(
    auth.adminOrUser,
    transactionValidator.validator,
    transactionController.create
  );
router
  .route("/:id")
  .put(
    auth.adminOrUser,
    transactionValidator.validator,
    transactionController.update
  );
router
  .route("/cancel/:id")
  .put(auth.adminOrUser, transactionController.cancelTransaction); //yang bakalan bisa cancel siapa aja? admin? user? partner? atau semuanya? hmmm

module.exports = router; // Export router