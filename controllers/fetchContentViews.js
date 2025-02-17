const Movies = require("../models/Movies");

exports.fetchContentViews = async (req, res, next) => {
  const { type } = req.params;
  let matchCondition = {}; // Make sure matchCondition is initialized

  try {
    if (type === "Month") {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );
      matchCondition.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (type === "Year") {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 11, 31);
      matchCondition.createdAt = { $gte: startOfYear, $lte: endOfYear };
    } else if (type !== "All") {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    const moviesData = await Movies.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          totalViews: { $sum: "$views" }, // Sum up the total views
          //   visibleTrueCount: {
          //     $sum: { $cond: [{ $eq: ["$visible", true] }, 1, 0] },
          //   },
          //   visibleFalseCount: {
          //     $sum: { $cond: [{ $eq: ["$visible", false] }, 1, 0] },
          //   },
        },
      },
    ]);
    const moviesResult = moviesData[0] || {
      totalMovies: 0,
      visibleTrueCount: 0,
      visibleFalseCount: 0,
    };
    res.status(200).json({ movies: moviesResult });
  } catch (error) {
   return res.status(500).json({ message: "Server error", error });
  }
};
