const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const authValidator = require("../middlewares/validators/authValidator");
// import validators

// import controllers
const partnerController = require("../controllers/partnerController");

router.get("/", partnerController.getAll);
router.get("/:id", partnerController.getOnePartner);
router.put(
  "/adminVerified/:id",
  auth.admin,
  partnerController.updateVerifiedPartner
);

module.exports = router;
