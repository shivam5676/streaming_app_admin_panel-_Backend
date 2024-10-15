const Layout = require("../models/Layout");
const Movies = require("../models/Movies");
const Slider = require("../models/Slider");

exports.getDashboardData = async (req, res, next) => {
  const { type } = req.params;
  try {
    let matchCondition = {};

    // Set the match condition based on the type
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

    // Perform aggregation to get the required counts
    const moviesData = await Movies.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalMovies: { $sum: 1 },
          visibleTrueCount: {
            $sum: { $cond: [{ $eq: ["$visible", true] }, 1, 0] },
          },
          visibleFalseCount: {
            $sum: { $cond: [{ $eq: ["$visible", false] }, 1, 0] },
          },
        },
      },
    ]);

    // Set default values if no movies match the criteria
    const moviesResult = moviesData[0] || {
      totalMovies: 0,
      visibleTrueCount: 0,
      visibleFalseCount: 0,
    };

    // const showsData = await WebShows.aggregate([
    //   { $match: matchCondition },
    //   {
    //     $group: {
    //       _id: null,
    //       totalMovies: { $sum: 1 },
    //       visibleTrueCount: {
    //         $sum: { $cond: [{ $eq: ["$visible", true] }, 1, 0] },
    //       },
    //       visibleFalseCount: {
    //         $sum: { $cond: [{ $eq: ["$visible", false] }, 1, 0] },
    //       },
    //     },
    //   },
    // ]);

    // Send the response with the fetched data
   
    // const showsREsult = showsData[0] || {
    //   totalMovies: 0,
    //   visibleTrueCount: 0,
    //   visibleFalseCount: 0,
    // };


    const layoutsData = await Layout.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalLayouts: { $sum: 1 },
          visibleTrueCount: {
            $sum: { $cond: [{ $eq: ["$visible", true] }, 1, 0] },
          },
          visibleFalseCount: {
            $sum: { $cond: [{ $eq: ["$visible", false] }, 1, 0] },
          },
        },
      },
    ]);

    // Set default values if no movies match the criteria
    const layoutResult = layoutsData[0] || {
      totalLayouts: 0,
      visibleTrueCount: 0,
      visibleFalseCount: 0,
    };
    const slidersData = await Slider.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalSliders: { $sum: 1 },
          visibleTrueCount: {
            $sum: { $cond: [{ $eq: ["$visible", true] }, 1, 0] },
          },
          visibleFalseCount: {
            $sum: { $cond: [{ $eq: ["$visible", false] }, 1, 0] },
          },
        },
      },
    ]);

    // Set default values if no movies match the criteria
    const SliderResult = slidersData[0] || {
      totalSliders: 0,
      visibleTrueCount: 0,
      visibleFalseCount: 0,
    };
    res.status(200).json({
      movies: moviesResult,
      layouts:layoutResult,
      sliders:SliderResult
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
