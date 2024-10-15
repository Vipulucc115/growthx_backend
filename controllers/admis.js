const Assignment = require("../models/assignment");

// Get all assignments tagged to the admin
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ admin: req.user._id }).populate(
      "userId",
      "username"
    );
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments." });
  }
};

// Accept Assignment
exports.acceptAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndUpdate(req.params.id, { status: "accepted" });
    res.status(200).json({ message: "Assignment accepted." });
  } catch (error) {
    res.status(500).json({ message: "Error accepting assignment." });
  }
};

// Reject Assignment
exports.rejectAssignment = async (req, res) => {
  try {
    await Assignment.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.status(200).json({ message: "Assignment rejected." });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting assignment." });
  }
};
