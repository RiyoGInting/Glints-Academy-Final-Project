const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authValidator = require("../middlewares/validators/authValidator");
// import validators

// import controllers
const userController = require("../controllers/userController");
router.get("/:id", auth.adminOrUser, userController.getOne);
router.put("/:id", auth.adminOrUser, userController.update);

module.exports = router;
