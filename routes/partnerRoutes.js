const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authValidator = require("../middlewares/validators/authValidator");
// import validators

// import controllers
const partnerController = require("../controllers/partnerController");

router.get("/",auth.partner, partnerController.getAll);
router.get("/getOne/:id", partnerController.getOnePartner);
router.get("/searchByName", partnerController.searchByName);
router.get("/searchByFilter", partnerController.searchByFilter);
router.get("/:id", partnerController.getOnePartner);
router.put(
  "/adminVerified/:id",
  auth.admin,
  partnerController.updateVerifiedPartner
);

module.exports = router;
