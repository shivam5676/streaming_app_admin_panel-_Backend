const mintsPlan = require("../../models/subscriptionPlan");

exports.AllMintsPlan = async (req, res) => {
  try {
    const response = await mintsPlan.find();
    console.log(response);
    if (!response) {
      return res.status(200).json({ subscriptionPlans: [] });
    }
    return res.status(200).json({ subscriptionPlans: response });
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};
