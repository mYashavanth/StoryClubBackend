// Express route for generating and sending OTP
const express = require("express");
const emailRouter = express.Router();
const nodemailer = require("nodemailer");

// Temporary storage for OTPs
let otpMap = new Map();
console.log(otpMap.forEach((value, key) => console.log(key, value)));

// Generate random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Endpoint to request OTP
emailRouter.post("/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();
    console.log(otp);
    otpMap.set(email, otp);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      // Setup transporter configuration
      service: "gmail",
      auth: {
        user: "yashavantham143@gmail.com",
        pass: "ivfq fxcb nrqq gige",
      },
    });

    const mailOptions = {
      // Setup mail options
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Endpoint to verify OTP
emailRouter.post("/verify-otp", (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(otpMap.get(email));
    if (otpMap.has(email) && otpMap.get(email) === otp) {
      // OTP matched, mark email as verified
      otpMap.delete(email);
      // Update MongoDB to mark email as verified
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

module.exports = emailRouter;
