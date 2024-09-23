const mongoose = require("mongoose");
const languageSchema = new mongoose.Schema( {
  name: String,
});
const Language=mongoose.model("Language",languageSchema)
module.exports=Language
