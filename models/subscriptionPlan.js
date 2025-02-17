const mongoose = require("mongoose");
const mintsPlanSchema = new mongoose.Schema({
  Quantity: Number,
  Price: Number,
  Description: String,
});
const mintsPlan = mongoose.model("mintsPlan", mintsPlanSchema);
module.exports = mintsPlan;
