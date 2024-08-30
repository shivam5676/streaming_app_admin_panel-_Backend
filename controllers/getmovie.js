const Movies = require("../models/Movies");

exports.getmovie = async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await Movies.findById(id).populate("shorts").exec();
    return res.status(200).json({ movieData: response });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
