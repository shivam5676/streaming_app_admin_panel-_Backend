const Layout = require("../models/Layout");
const Movies = require("../models/Movies");
const mongoose = require("mongoose");
const { get } = require("../routes/admin");
exports.addLayout = async (req, res, next) => {
  const { name, Description, linkedMovies ,visible} = req.body;
  console.log(linkedMovies);
  // return;

  //   console.log(movies);
  try {
    const layoutResponse = await Layout.create({
      name: name,
      Description: Description,
      visible
      // linkedMovies: linkedMovies,
    });
    console.log(layoutResponse);
    if (linkedMovies.length > 0) {
      
      const moviesResponses = linkedMovies.map(async (currentMovie) => {
        const getMovie = await Movies.findById(currentMovie._id);
        if (getMovie) {
          console.log(getMovie, "getMovie");
          console.log(layoutResponse, "layout response.......");
          getMovie.layouts.push(layoutResponse._id);
          layoutResponse.linkedMovies.push(getMovie._id);
          await getMovie.save();
          console.log(await layoutResponse.save(), "......new response");
        }
      });
      await Promise.all(moviesResponses);
      
    }
    return res.status(200).json({ layoutResponse });
  } catch (err) {
    console.log(err);
  }
};
