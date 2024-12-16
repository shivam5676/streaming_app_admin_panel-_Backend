const mongoose = require("mongoose");
const database = require("../util/database");
const AdsSchema = new mongoose.Schema({
  name: String,
  type: String,
  visible: Boolean,
  position: String,
  sessionType: String,
  provider: String,
});
const Ads = mongoose.model("Ads", AdsSchema);
module.exports = Ads;
