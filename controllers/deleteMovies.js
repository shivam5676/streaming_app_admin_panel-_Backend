const Movies = require("../models/Movies");

exports.deleteMovies = async (req, res, next) => {
  const { id } = req.body;
  try {
    const deleteResponse = await Movies.findByIdAndDelete(id);
    console.log(deleteResponse);
  } catch (err) {
    console.log(err);
  }
};
