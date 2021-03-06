const express = require("express");
const passport = require("passport");

const authValidator = require("../middlewares/validators/authValidator");
const authController = require("../controllers/authController");
const { uploadKTP, uploadLogo } = require("../middlewares/uploads/uploadFlow");
const partnerValidator = require("../middlewares/validators/partnerValidator");

const auth = require("../middlewares/auth/index");
const router = express.Router();

router.post(
  "/signup/partner",
  authValidator.signupPartner,
  partnerValidator.create,
  uploadKTP,
  uploadLogo,
  auth.signupPartner,
  authController.getTokenPartner
);

router.post(
  "/signin/partner",
  auth.signinPartner,
  authController.getTokenPartner
);
router.post(
  "/signup",
  authValidator.signup,
  auth.signup,
  authController.getToken
);
router.post("/signin", auth.signin, authController.getToken);

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["openid", "profile", "email"],
  })
);
//callback route for google redirect to
router.get(
  "/google/redirect",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/signin",
  }),
  authController.getToken
);
module.exports = router;
