const Slider = require("../models/Slider");

exports.getAllSliders = async (req, res) => {
  const { start, limit, searched } = req.query;
  console.log(start, limit,searched);
  
  let filter = {};
  try {
    if (searched && searched.trim() !== "") {
      filter = {
        $or: [
          { schemaName: { $regex: searched, $options: "i" } },
          { type: { $regex: searched, $options: "i" } },
          { promotionalImageUrl: { $regex: searched, $options: "i" } },
          { RedirectionLink: { $regex: searched, $options: "i" } },
        ],
      };
    }
    const totalSliders = await Slider.countDocuments(filter);
    const response = await Slider.find(filter)
      .populate("linkedMovie")
      .skip(limit * start)
      .limit(limit);
    if (!response) {
      return res.status(200).json({ Slider: [] });
    }
    return res.status(200).json({
      Slider: response,
      start,
      limit,
      totalData: totalSliders,
      totalPages: Math.ceil(totalSliders / limit),
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: error });
  }
};
