const Layout = require("../models/Layout");

exports.getAllLayout = async (req, res) => {
  const response = await Layout.find().select("name _id");
  return res.status(200).json({ Layout: response });
};
