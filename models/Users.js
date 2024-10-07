const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  loggedInBefore: Boolean,

  selectedGenre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],

  selectedLanguages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
  ],
});
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
