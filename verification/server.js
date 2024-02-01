// server.js
const express = require("express");
const serverRouter = express.Router();
const bodyParser = require("body-parser");
const { generateOTP, sendOTP } = require("./otpService");


serverRouter.use(bodyParser.json());
const storedOTP = {};

// Route to generate OTP and send to phone
serverRouter.post("/generate-otp", (req, res) => {
  const { phoneNumber } = req.body;
  console.log({ phoneNumber });
  const otp = generateOTP(); // Generate OTP
  storedOTP[phoneNumber] = otp;
  sendOTP(phoneNumber, otp); // Send OTP to the phone number
  res.send({ success: true, message: "OTP sent successfully" });
});

// Route to verify OTP
serverRouter.post("/verify-otp", (req, res) => {
  const { otp, phoneNumber } = req.body;
  
  if (otp === storedOTP[phoneNumber]) {
    res.json({ success: true, message: "OTP verified successfully" });
  } else {
    res
      .status(400)
      .json({ success: false, message: "OTP verification failed" });
  }
});


module.exports = serverRouter;
