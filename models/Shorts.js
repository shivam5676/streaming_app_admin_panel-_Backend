const mongoose = require("mongoose");
const shortsSchema = new mongoose.Schema({
  name: String,
  fileLocation: String,
  genre: String,
  visible: { type: Boolean, required: true },
});
const Shorts = mongoose.model("Shorts", shortsSchema);

// console.log(result);
module.exports = Shorts;
