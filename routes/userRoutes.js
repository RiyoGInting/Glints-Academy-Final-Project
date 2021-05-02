const express = require("express");
const router = express.Router();

// import validators

// import controllers
const userController = require("../controllers/userController");

router.get("/:id", userController.getOne);

module.exports = router;
