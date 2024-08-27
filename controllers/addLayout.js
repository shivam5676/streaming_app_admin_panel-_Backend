const Layout = require("../models/Layout");

exports.addLayout = async (req, res, next) => {
  const { name, Description, linkedMovies } = req.body;
//   console.log(movies);
  try {
    const layoutResponse = await Layout({
      name: name,
      Description: Description,
      linkedMovies: linkedMovies,
    });
    console.log(layoutResponse);
  } catch (err) {
    console.log(err);
  }
};
