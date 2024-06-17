const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = "your_jwt_secret";

router.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send("Username is required");
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.send("Login successful");
});

module.exports = router;
