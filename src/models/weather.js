const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  city: String,
  highestTemp: Number,
  lowestTemp: Number,
});

module.exports = mongoose.model("Weather", weatherSchema);
