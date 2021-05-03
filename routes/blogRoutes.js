const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import middlewares
const { imageUpload } = require("../middlewares/uploads/imageUpload");
const blogValidator = require("../middlewares/validators/blogValidator");
const auth = require("../middlewares/auth");  // ?

// Import controller
const blogController = require("../controllers/blogController");

// Get All, Get One, Create, Update, Delete
router.get("/", blogController.getAll);
router.get("/:id", blogController.getOne);
router.post("/", imageUpload, blogValidator.create, blogController.create);
router.put("/:id", blogValidator.update, blogController.update);
router.delete("/:id", blogController.delete);

module.exports = router; // Export router