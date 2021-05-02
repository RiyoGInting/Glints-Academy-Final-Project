const express = require("express");
const passport = require("passport");

const authValidator = require("../middlewares/validators/authValidator");
const authController = require("../controllers/authController");

const auth = require("../middlewares/auth/index");
const router = express.Router();


router.post("/signup/partner", auth.signupPartner, authController.getTokenPartner);

router.post("/signin/partner", auth.signinPartner, authController.getTokenPartner);
router.post(
  "/signup",
  authValidator.signup,
  auth.signup,
  authController.getToken
);
router.post("/signin", auth.signin, authController.getToken);

module.exports = router;
