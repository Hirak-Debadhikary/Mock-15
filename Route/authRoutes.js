const express = require("express");
const router = express.Router();
// const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const User = require("../model/user");

// Register API
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new User({
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      });

      newUser
        .save()
        .then((user) => {
          const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
          res.status(200).json({ token });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Fetch user from the database based on email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    // Verify password using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    // Generate JWT token and send it to the client
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
