const { response } = require("express");
const mintsPlan = require("../../models/subscriptionPlan");

exports.AllMintsPlan = async (req, res) => {
  const { start, limit, searched = "" } = req.query;
  console.log(start, limit, searched);
  if (isNaN(searched)) return res.status(400).json({ msg: "Search only number not string" });
  let filter = {};
  try {
    if (searched && searched.trim() !== "") {
      const regex = new RegExp(searched); // use the digit as regex string
      filter = {
        $or: [
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$Quantity" },
                regex: regex,
              },
            },
          },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$Price" },
                regex: regex,
              },
            },
          },
        ],
      };
    }
    const totalMintsPlanCount = await mintsPlan.countDocuments(filter);
    const response = await mintsPlan.find(filter).skip(limit * start)
      .limit(limit);

    console.log(response);
    if (!response) {
      return res.status(200).json({ subscriptionPlans: [] });
    }
    return res.status(200).json({
      subscriptionPlans: response, start,
      limit,
      totalData: totalMintsPlanCount,
      totalPages: Math.ceil(totalMintsPlanCount / limit),
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({ err: error });
  }
};