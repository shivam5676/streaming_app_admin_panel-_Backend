const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    loggedInBefore: Boolean,

    selectedGenre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],

    selectedLanguages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Language" },
    ],
    BookMark: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shorts" }],
    LikedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shorts" }],
    Devices: [
      {
        fcmtoken: { type: String, required: true }, // The FCM token for this device
        deviceType: {
          type: String,
          enum: ["Android", "iOS", "Web"],
          required: true,
        }, // Type of device
        lastUpdated: { type: Date, default: Date.now }, // Timestamp of the last token update
      },
    ],
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  }
);
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
