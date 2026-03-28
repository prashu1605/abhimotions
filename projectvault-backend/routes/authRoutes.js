const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const otpStore = require("../utils/otpStore");

// SIGNUP
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields required" });
    }

console.log("OTP route hit", email);

    // ✅ VERIFY OTP
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (stored.expires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (stored.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // delete OTP after use
    otpStore.delete(email);

    // existing logic
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: user.role, });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  
  const otp = Math.floor(100000 + Math.random() * 900000);

  console.log("OTP generated:", otp);

  otpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
   auth: {
  user: "abhimotions@gmail.com",
  pass: "muxn vkzj yhah wysl",
},
  });

  try {
    await transporter.sendMail({
      from: "abhimotions@gmail.com",
      to: email,
      subject: "Your OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: "OTP sent" });
  } catch (err) {
  console.log(err);   // 🔥 ADD THIS
  res.status(500).json({ message: "Failed to send OTP" });
}
});

module.exports = router;
