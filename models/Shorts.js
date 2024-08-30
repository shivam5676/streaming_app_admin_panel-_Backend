const mongoose = require("mongoose");
const shortsSchema = new mongoose.Schema({
  name: String,
  fileLocation: String,
  genre: String,
  visible: { type: Boolean, required: true },
  Movies: { type: mongoose.Schema.Types.ObjectId, ref: "Movies" },
});
const Shorts = mongoose.model("Shorts", shortsSchema);

// console.log(result);
module.exports = Shorts;
