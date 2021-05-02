const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import validator
const serviceValidator = require("../middlewares/validators/serviceValidator");

// Import controller
const serviceController = require("../controllers/serviceController");

router
  .route("/")
  .get(serviceController.getAll)
  .post(serviceValidator.validator, serviceController.create);
router.route("/search").get(serviceController.searchByName);
router.route("/partner/:id").get(serviceController.getAllByPartner);
router.route("/category/:id").get(serviceController.getAllByCategory);
router
  .route("/:id")
  .get(serviceController.getOne)
  .put(serviceValidator.validator, serviceController.update)
  .delete(serviceController.delete);

module.exports = router; // Export router
