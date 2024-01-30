const express = require("express");
const userRouter = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlackedToken = require("../models/blackedToken.model");

const isPasswordValid = (password) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
};

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, pass, phoneNumber } = req.body;
    if (!isPasswordValid(pass)) {
      return res.status(400).send({ msg: "Password must be strong" });
    }
    bcrypt.hash(pass, 5, async (err, hash) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        const user = new User({
          name,
          email,
          pass: hash,
          phoneNumber,
        });
        await user
          .save()
          .then(() => {
            res.status(200).send({
              msg: "The new user has been registered",
              registeredUser: user,
            });
          })
          .catch((err) => {
            res.status(400).send({
              msg: "Registerd email already exist",
              error: err.message,
            });
          });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(pass, user.pass, function (err, result) {
        if (result) {
          const authToken = jwt.sign(
            { userID: user._id },
            process.env.authToken,
            {
              expiresIn: "1h",
            }
          );
          const refreshToken = jwt.sign(
            { userID: user._id },
            process.env.refreshToken,
            {
              expiresIn: "7d",
            }
          );
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
          res.cookie("authToken", authToken, {
            httpOnly: true,
            maxAge: 1  * 60 * 60 * 1000,
          });
          res
            .status(200)
            .send({ msg: "Login successful!", authToken, refreshToken });
        } else {
          res.status(400).send({ msg: "Invalid Credentials, Please check your password" });
        }
      });
    }else{
      res.status(400).send({ msg: "Invalid Credentials, Please check your email" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

userRouter.get("/logout", async (req, res) => {
  try {
    const { authToken, refreshToken } = req.cookies;
    const blacked = new BlackedToken({
      authToken,
      refreshToken,
    });
    await blacked.save().then(() => {
      res
        .clearCookie("authToken")
        .clearCookie("refreshToken")
        .status(200)
        .send({ msg: "Logout successful!" });
    }).catch((err) => {
        throw new Error(err)
    })
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = userRouter;
