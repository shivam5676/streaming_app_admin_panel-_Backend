const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  name: String,
  Description: String,
  linkedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movies" }],
  visible:Boolean
},{
  timestamps: true, // This adds createdAt and updatedAt automatically
});

const Layout = mongoose.model("Layout", sliderSchema);
module.exports = Layout;
