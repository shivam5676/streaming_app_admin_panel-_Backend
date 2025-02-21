const Layout = require("../models/Layout");

exports.getAllLayout = async (req, res) => {
  const { start, limit, searched } = req.query;

  console.log(start, limit, searched);

  let filter = {};
  if (searched && searched.trim() !== "") {
    filter = {
      $or: [
        { name: { $regex: searched, $options: "i" } },
        { Description: { $regex: searched, $options: "i" } },
      ],
    };
  }
  const totalLayouts = await Layout.countDocuments(filter);
  const response = await Layout.find(filter).select("name _id visible").skip(limit * start)
  .limit(limit);
  if (!response) {
    return res.status(200).json({ Layout: [] });
  }
  return res
    .status(200)
    .json({
      Layout: response,
      start,
      limit,
      totalData: totalLayouts,
      totalPages: Math.ceil(totalLayouts / limit),
    });
};
