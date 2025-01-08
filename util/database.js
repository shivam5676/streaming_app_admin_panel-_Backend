const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectionString = process.env.CONNECTION_STRING;

const connectDb = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log("connected to mongo db");
  } catch (err) {
    console.log("wrr ehile connecting to mongo db", err);
  }

  //   .then(() => console.log("Connected to MongoDB"))
  //   .catch((error) => console.error("MongoDB connection error:", error));
};

module.exports = connectDb;
