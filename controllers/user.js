const Assignment = require("../models/assignment");
const User = require("../models/user");

// Register and Login logic would be implemented here...

// Upload an Assignment
exports.uploadAssignment = async (req, res) => {
  try {
    const { task, adminId } = req.body;
    const assignment = new Assignment({
      userId: req.user._id,
      task,
      admin: adminId,
    });
    await assignment.save();
    res.status(201).json({ message: "Assignment uploaded successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error uploading assignment." });
  }
};
