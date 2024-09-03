const Layout = require("../models/Layout");
const Movies = require("../models/Movies");
const mongoose = require("mongoose");
const { get } = require("../routes/admin");
exports.editLayout = async (req, res, next) => {
  const { name, Description, linkedMovies, id } = req.body;
  console.log(linkedMovies);
  // return;

  //   console.log(movies);
  try {
    // const layoutResponse = await Layout.findById(id);
    // const layoutResponse = await Layout.create({
    //   name: name,
    //   Description: Description,
    //   // linkedMovies: linkedMovies,
    // });
    console.log(layoutResponse);
    return
    if (linkedMovies.length > 0) {
      const moviesResponses = linkedMovies.map(async (currentMovie) => {
        const getMovie = await Movies.findById(currentMovie._id);
        if (getMovie) {

        }
      });
      await Promise.all(moviesResponses);
    }
    return res.status(200).json({ layoutResponse });
  } catch (err) {
    console.log(err);
  }
};
