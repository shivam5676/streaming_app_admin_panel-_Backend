const Ads = require("../models/AdvertiseMent");

exports.AllAds = async (req, res) => {
  try {
    const adsListResponse = await Ads.find();
    return res.status(200).json({ AdsList: adsListResponse });
    console.log(response);
  } catch (error) {
    return res.status(500).json({ msg: "something went wrong", err: error });
  }
};
