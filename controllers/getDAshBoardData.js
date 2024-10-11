const Movies = require("../models/Movies");

exports.getDashboardData = async (req, res, next) => {
  const { type } = req.params;
  try {
    let matchCondition = {};

    // Set the match condition based on the type
    if (type === "month") {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      matchCondition.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (type === "year") {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 11, 31);
      matchCondition.createdAt = { $gte: startOfYear, $lte: endOfYear };
    } else if (type !== "all") {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    // Perform aggregation to get the required counts
    const moviesData = await Movies.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          visibleTrueCount: { $sum: { $cond: [{ $eq: ["$visible", true] }, 1, 0] } },
          visibleFalseCount: { $sum: { $cond: [{ $eq: ["$visible", false] }, 1, 0] } }
        }
      }
    ]);

    // Set default values if no movies match the criteria
    const result = moviesData[0] || { totalMovies: 0, visibleTrueCount: 0, visibleFalseCount: 0 };

    // Send the response with the fetched data
    res.status(200).json({
      totalMovies: result.totalMovies,
      visibleTrueCount: result.visibleTrueCount,
      visibleFalseCount: result.visibleFalseCount
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
