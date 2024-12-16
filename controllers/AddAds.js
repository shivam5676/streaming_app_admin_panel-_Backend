const Ads = require("../models/AdvertiseMent");

exports.addAds = async (req, res) => {
  console.log(req.body);
  const { name, type, Provider, visible, position, sessionType } = req.body;
  if(!name){
    return res.status(400).json({"msg":"name field should contains some value"})
  }
  if(!type){
    return res.status(400).json({"msg":"Ads type field should contains some value"})
  }
  if(!Provider){
    return res.status(400).json({"msg":"Ads Provider field should contains some value"})
  }
  if(!position){
    return res.status(400).json({"msg":"Ads position field should contains some value"})
  }
  if(!sessionType){
    return res.status(400).json({"msg":"Ads display behaviour field should contains some value"})
  }
  try {
    const adsResponse = await Ads.create({
      name: name,
      type:type,
      provider: Provider,
      visible: visible,
      sessionType: sessionType,
      position: position,
    });
    adsResponse.save();
  } catch (error) {
    console.log(error);
  }
};
