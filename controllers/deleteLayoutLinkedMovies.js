const Layout = require("../models/Layout");
const Movies = require("../models/Movies");

exports.deleteLayoutLinkedMovies = async (req, res) => {
  //   console.log(req.body);
  const { LayoutId, movieId } = req.body;
  //   console.log(LayoutId);
  //   console.log(movieId);
  // return
  try {
    const layoutResponse = await Layout.findById(LayoutId);
    // console.log(layoutResponse);
    if (layoutResponse) {
      await layoutResponse.linkedMovies.pull(movieId);
      const moviesResponse = await Movies.findById(movieId);
      if (moviesResponse) {
        await moviesResponse.layouts.pull(LayoutId);
        await layoutResponse.save();
        await moviesResponse.save();
      }
      return res.status(200).json({ msg: "movie removed from this layout" });
    }
  } catch (error) {
    return res.status(400).json({ msg: error });
  }
};
