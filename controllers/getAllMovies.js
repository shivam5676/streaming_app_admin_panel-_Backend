const Movies = require("../models/Movies");

exports.getAllMovies = async (req, res, next) => {
  try {
    const allMovies = await Movies.find();
    return res.status(200).json({allMovies});
    
  } catch (err) {
    console.log(err);
  }
};
