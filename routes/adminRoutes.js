const express = require("express");
const {
  getAssignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/admin");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/assignments", auth, getAssignments);
router.post("/assignments/:id/accept", auth, acceptAssignment);
router.post("/assignments/:id/reject", auth, rejectAssignment);

module.exports = router;
