const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const userValidator = require("../middlewares/validators/userValidator");
// import validators

// import controllers
const userController = require("../controllers/userController");
router.get("/:id", auth.adminOrUser, userController.getOne);
router.put(
  "/:id",
  auth.adminOrUser,
  userValidator.updateUser,
  userController.update
);
router.post(
  "/verifyEmail",
  userValidator.verifyEmail,
  userController.verifyEmail
);

module.exports = router;
