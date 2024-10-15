const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
// Initialize dotenv to use environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define user and assignment schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const assignmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  task: String,
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Models
const User = mongoose.model("User", userSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);

// Middleware to authenticate users
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

// Routes
// Register User/Admin
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Validate input
  if (!username || !password || !role)
    return res.status(400).send("All fields are required.");

  // Check if user already exists
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).send("User already exists.");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({ username, password: hashedPassword, role });
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login User/Admin
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password)
    return res.status(400).send("Username and password required.");

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found.");

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password.");

  // Generate JWT token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET
  );
  res.header("Authorization", token).send({ token });
});

// User Upload Assignment
app.post("/upload", authenticateToken, async (req, res) => {
  if (req.user.role !== "user")
    return res.status(403).send("Only users can upload assignments.");

  const { task, adminId } = req.body;
  const assignment = new Assignment({
    userId: req.user._id,
    task,
    admin: adminId,
  });

  try {
    const savedAssignment = await assignment.save();
    res.status(201).send(savedAssignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Admin View Assignments
app.get("/assignments", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send("Only admins can view assignments.");

  try {
    const assignments = await Assignment.find({ admin: req.user._id })
      .populate("userId", "username")
      .exec();
    res.status(200).send(assignments);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Admin Accept Assignment
app.post("/assignments/:id/accept", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send("Only admins can accept assignments.");

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).send("Assignment not found.");

    assignment.status = "accepted";
    await assignment.save();
    res.status(200).send(assignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Admin Reject Assignment
app.post("/assignments/:id/reject", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).send("Only admins can reject assignments.");

  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).send("Assignment not found.");

    assignment.status = "rejected";
    await assignment.save();
    res.status(200).send(assignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all admins
app.get("/admins", authenticateToken, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("username");
    res.status(200).send(admins);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
