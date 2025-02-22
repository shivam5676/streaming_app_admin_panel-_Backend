const Movies = require("../models/Movies");

exports.getAllMovies = async (req, res, next) => {
  const { start, limit , searched = "" } = req.query;
  console.log(start, limit, searched);

  let filter = {};
  try {
    if (searched && searched.trim() !== "") {
      filter = {
        $or: [{ name: { $regex: searched, $options: "i" } }],
      };
    }
    const totalMoviesCount = await Movies.countDocuments(filter);
    const allMovies = await Movies.find(filter)
      .populate([
        {
          path: "layouts",
          select: "name ", // Only include 'name' and 'type' fields
        },
        {
          path: "genre",
          select: "name ", // Only include 'name' and 'type' fields
        },
      ])
      .skip(limit * start)
      .limit(limit);
    // console.log(allMovies[0].layouts)
    if (!allMovies) {
      return res.status(200).json({ allMovies: [] });
    }
    return res.status(200).json({
      allMovies,
      start,
      limit,
      totalData: totalMoviesCount,
      totalPages: Math.ceil(totalMoviesCount / limit),
    });
  } catch (err) {
    console.log(err);
  }
};
