const mongoose = require("mongoose");
const checkInpointsSchema = new mongoose.Schema({
  Day: Number,
  title: String,
  allocatedPoints: Number,
});
const checkInpoints = mongoose.model("checkInPoints", checkInpointsSchema);
module.exports = checkInpoints;
