const Layout = require("../../models/Layout");

exports.getLayoutData = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Layout.findById(id).populate({
      path: "linkedMovies",
      select: "_id name",
    });
    return res.status(200).json({ Layout: response });
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};
