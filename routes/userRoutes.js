const express = require("express");
const { uploadAssignment } = require("../controllers/user");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/upload", auth, uploadAssignment);
router.get("/admins", auth, getAdmins); // Assuming getAdmins will return all admins.

module.exports = router;
