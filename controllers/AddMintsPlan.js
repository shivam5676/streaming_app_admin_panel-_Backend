const mintsPlan = require("../models/subscriptionPlan");

exports.AddMintsPlan = async (req, res) => {
  const { price, quantity, description } = req.body;
  if (isNaN(price) || price < 0) {
    return res.status(400).json({
      msg: "price should only integer and positive value >= 0",
      err: error,
    });
  }
  if (quantity <= 0) {
    return res.status(400).json({
      msg: "Mints Quantity should only integer and positive value >= 0",
    });
  }
  try {
    const mints = await mintsPlan.create({
      Price: price,
      Quantity: quantity,
      Description: description,
    });
    if (!mints) {
      return res.status(400).json({
        msg: "we faced problem while saving plan.please check all the required fields.",
      });
    }
    return res.status(200).json({ msg: "subscription plan added..." });
  } catch (err) {
    return res.status(500).json({ msg: "something went wrong", err: err });
  }
};
