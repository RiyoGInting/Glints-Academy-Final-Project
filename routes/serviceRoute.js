const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import validator
//const serviceValidator = require("../middlewares/validators/serviceValidator");

// Import controller
const serviceController = require("../controllers/serviceController");

router.route("/").get(serviceController.getAll).post(serviceController.create);
router
  .route("/:id")
  .get(serviceController.getOne)
  .put(serviceController.update)
  .delete(serviceController.delete);
router.route("/partner/:id").get(serviceController.getAllByPartner);
router.route("/category/:id").get(serviceController.getAllByCategory);
//router.route("/search/").get(serviceController.searchByName);

module.exports = router; // Export router
