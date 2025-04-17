const Ads = require("../../models/AdvertiseMent");

exports.AllAds = async (req, res) => {
  const { start, limit, searched = "" } = req.query;
  console.log(start, limit, searched);

  let filter = {};
  try {
    if (searched && searched.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: searched, $options: "i" } },
          { position: { $regex: searched, $options: "i" } },
          { provider: { $regex: searched, $options: "i" } },
        ],
      };
    }
    const totalAdsCount = await Ads.countDocuments(filter);
    const adsListResponse = await Ads.find(filter)
      .skip(limit * start)
      .limit(limit);
    if (!adsListResponse) {
      return res.status(200).json({
        AdsList: [],
      });
    }
    return res.status(200).json({
      AdsList: adsListResponse,
      start,
      limit,
      totalData: totalAdsCount,
      totalPages: Math.ceil(totalAdsCount / limit),
    });
  } catch (error) {
    return res.status(500).json({ msg: "something went wrong", err: error });
  }
};
