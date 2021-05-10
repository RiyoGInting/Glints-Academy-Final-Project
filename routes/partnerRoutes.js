const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");

const { uploadKTP, uploadLogo } = require("../middlewares/uploads/uploadFlow");
const partnerValidator = require("../middlewares/validators/partnerValidator");

// import validators

// import controllers
const partnerController = require("../controllers/partnerController");

router.get("/", partnerController.getAll);
router.get("/adminVerified/", auth.admin, partnerController.getAll);
router.get("/getOne/:id", partnerController.getOnePartner);
router.get("/profileService/:id", partnerController.getOnePartnerProfile);
router.get("/searchByName", partnerController.searchByName);
router.get("/searchByFilter", partnerController.searchByFilter);
router.post(
  "/verifyEmailPartner",
  partnerValidator.verifyEmailPartner,
  partnerController.verifyEmailPartner
);

router.put(
  "/adminVerified/:id",
  auth.admin,
  partnerController.updateVerifiedPartner
);

router.put(
  "/updateService/:id",
  auth.partner,
  partnerValidator.updateService,
  uploadLogo,
  partnerController.updateProfileService
);

router.put(
  "/updateProfile/:id",
  auth.partner,
  partnerValidator.update,
  uploadLogo,
  partnerController.updateProfile
);
module.exports = router;
