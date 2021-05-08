const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authValidator = require("../middlewares/validators/authValidator");
// import validators

// import controllers
const partnerController = require("../controllers/partnerController");

router.get("/", partnerController.getAll);
router.get("/adminVerified/", auth.admin, partnerController.getAll);
router.get("/getOne/:id", partnerController.getOnePartner);
router.get("/profileService/:id", partnerController.getOnePartnerProfile);
router.get("/searchByName", partnerController.searchByName);
router.get("/searchByFilter", partnerController.searchByFilter);

router.put(
  "/adminVerified/:id",
  auth.admin,
  partnerController.updateVerifiedPartner
);

module.exports = router;
