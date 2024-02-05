const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const validator = require("validator");
require("dotenv").config();

const hireRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let filename = "";
    if (file.fieldname === "resume") {
      filename = "resume.pdf";
    } else if (file.fieldname === "cv") {
      filename = "cv.pdf";
    } else {
      filename = file.originalname; // Use the original filename for other files
    }
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

hireRouter.use(express.urlencoded({ extended: true }));

hireRouter.post(
  "/upload-details",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Request body validation
      const { name, email, mobile, category } = req.body;
      if (!name || !email || !mobile || !category) {
        throw new Error("All fields are required.");
      }
      const isEmailValid = validator.isEmail(email);
      const isMobileValid = validator.isMobilePhone(mobile, "en-IN");

      if (!isEmailValid) {
        throw new Error("Invalid email address.");
      }
      if (!isMobileValid) {
        throw new Error("Invalid mobile number.");
      }

      // Check if files were uploaded
      if (!req.files || Object.keys(req.files).length === 0) {
        throw new Error("No files were uploaded.");
      }

      const resumePath = path.join(__dirname, "../uploads/resume.pdf");
      const cvPath = path.join(__dirname, "../uploads/cv.pdf");

      // Prepare email options
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: "bossyash143@gmail.com",
        subject: "Details with Attached Files",
        text: `Name: ${name}\nEmail: ${email}\nMobile: ${mobile}\nCategory: ${category}`,
        attachments: [
          {
            filename: "resume.pdf",
            path: resumePath,
          },
          {
            filename: "cv.pdf",
            path: cvPath,
          },
        ],
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);

      console.log("Email sent:", info.response);

      // Delete uploaded files after sending email
      fs.unlinkSync(resumePath);
      fs.unlinkSync(cvPath);

      res.status(200).json({ message: "Email sent successfully." });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(400).json({ error: error.message }); // Send appropriate error response
    }
  }
);

module.exports = hireRouter;
