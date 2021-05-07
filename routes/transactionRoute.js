const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import auth
const auth = require("../middlewares/auth");

// Import validator
const transactionValidator = require("../middlewares/validators/transactionValidator");

// Import controller
const transactionController = require("../controllers/transactionController");

//user
router.route("/").get(auth.adminOrUser, transactionController.getAllByUser);
router
  .route("/")
  .post(
    //auth.adminOrUser,
    transactionValidator.validator,
    transactionController.create
  );
router
  .route("/:id")
  .get(auth.adminOrUser, transactionController.getOneByUser)
  .put(
    //auth.adminOrUser,
    transactionValidator.validator,
    transactionController.update
  );

//partner
// router
//   .route("/partner")
//   .get(auth.partner, transactionController.getAllByPartner);
// router
//   .route("/partner/:id")
//   .get(auth.partner, transactionController.getOneByPartner)
//   .put(auth.partner, transactionController.updateStatus);

module.exports = router; // Export router
