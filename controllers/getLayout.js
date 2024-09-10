const Layout = require("../models/Layout");

exports.getLayout = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const response = await Layout.findById(id).populate({path:"linkedMovies",select:"_id name"});
  return res.status(200).json({ Layout: response });
};
