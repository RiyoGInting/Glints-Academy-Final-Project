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
router.get("/getOne/:id", auth.adminOrUser, partnerController.getOnePartner);
router.get(
  "/getPartner",
  auth.partner,
  partnerController.getOnePartnerProfile
);
router.get("/searchByName", partnerController.searchByName);
router.get("/filterByCategory", partnerController.filterByCategory);
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
  partnerController.updateProfileService
);

router.put(
  "/updateProfile/",
  auth.partner,
  partnerValidator.update,
  partnerController.updateProfile
);

router.put(
  "/updateLogoPartner/",
  auth.partner,
  partnerValidator.updateLogo,
  uploadLogo,
  partnerController.updatePhoto
);
module.exports = router;
