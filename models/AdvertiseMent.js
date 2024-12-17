const mongoose = require("mongoose");
const database = require("../util/database");
const AdsSchema = new mongoose.Schema({
  name: String,
  type: String,
  visible: Boolean,
  position: String,
  sessionType: String,
  provider: String,
},{
  timestamps: true, // This adds createdAt and updatedAt automatically
});
const Ads = mongoose.model("Ads", AdsSchema);
module.exports = Ads;
