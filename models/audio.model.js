const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
});

const Audio = mongoose.model("audio", audioSchema);

module.exports = Audio;
