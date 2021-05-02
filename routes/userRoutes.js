const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
// import validators

// import controllers
const userController = require("../controllers/userController");
router.get("/:id", auth.adminOrUser, userController.getOne);
router.put("/:id", userController.update);

module.exports = router;
