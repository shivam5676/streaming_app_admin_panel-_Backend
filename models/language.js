const mongoose = require("mongoose");
const languageSchema = new mongoose.Schema( {
  name: String,
},{
  timestamps: true, // This adds createdAt and updatedAt automatically
});
const Language=mongoose.model("Language",languageSchema)
module.exports=Language
