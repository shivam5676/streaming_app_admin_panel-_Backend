const Layout = require("../models/Layout");
const Movies = require("../models/Movies");
const mongoose = require("mongoose");
const { get } = require("../routes/admin");
exports.editLayout = async (req, res, next) => {
  const { name, Description, linkedMovies, id } = req.body;
  console.log(linkedMovies);

  try {
    const layoutResponse = await Layout.findById(id);

    if (linkedMovies.length > 0) {
      const moviesResponses = linkedMovies.map(async (currentMovie) => {
        const getMovie = await Movies.findById(currentMovie._id);
        if (getMovie) {
          console.log(getMovie, "....>", id);

          await getMovie.layouts.push(id);
          await layoutResponse.linkedMovies.push(currentMovie._id);
          await getMovie.save();
        }
      });

      await Promise.all(moviesResponses);
      await layoutResponse.save();
    }
    return res.status(200).json({ layoutResponse });
  } catch (err) {
    console.log(err);
  }
};
