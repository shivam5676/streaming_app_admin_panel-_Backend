const Ads = require("../models/AdvertiseMent");

exports.AllAds = async (req, res) => {
  try {
    const response = await Ads.find();
    
    console.log(response);
  } catch (error) {}
};
