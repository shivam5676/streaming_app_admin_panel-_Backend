const Language = require("../models/language");


exports.getAllLLanguages = async (req, res) => {
  try {
    const response = await Language.find();
    console.log(response)
    if (!response) {
      return res.status(200).json({ Languages: [] });
    }
    return res.status(200).json({ Languages: response });
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};
