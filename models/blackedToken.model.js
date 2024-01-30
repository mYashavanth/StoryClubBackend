const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    authToken: {
      type: String,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const BlackedToken = mongoose.model("blacklist", blacklistSchema);

module.exports = BlackedToken;
