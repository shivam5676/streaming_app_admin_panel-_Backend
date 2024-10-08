const { status } = require("express/lib/response");
const Movies = require("../models/Movies");

exports.deleteMovies = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deleteResponse = await Movies.findByIdAndDelete(id);
    if (!deleteResponse) {
      return res
        .status(400)
        .json({ msg: "umable to find movie ", status: false });
    }
    return res.status(200).json({ msg: "deleted Successfully" });
  } catch (err) {
    return res.status(400).json({ msg: err });
  }
};
