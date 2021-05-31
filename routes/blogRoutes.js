const express = require("express"); // Import express
const router = express.Router(); // Make a router

// Import middlewares
// const { blogUpload } = require("../middlewares/uploads/blogUpload");
const blogValidator = require("../middlewares/validators/blogValidator");
const auth = require("../middlewares/auth");
const { uploadBlogImage } = require("../middlewares/uploads/uploadFlow");

// Import controller
const blogController = require("../controllers/blogController");

// Get All, Get One, Create, Update, Delete
router.get("/", blogController.getAll);
router.get("/:id", blogController.getOne);
router.post("/", auth.admin, blogValidator.create, uploadBlogImage, blogController.create);
router.put("/:id", auth.admin, blogValidator.update, blogController.update);
router.delete("/:id", auth.admin, blogController.delete);

module.exports = router; // Export router