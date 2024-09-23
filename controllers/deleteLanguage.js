const Language = require("../models/language");

exports.deleteLanguage = async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deleteResponse = await Language.findByIdAndDelete(id);
    if (!deleteResponse) {
      return res
        .status(400)
        .json({ msg: "could not deleted the language ..try again " });
    }
    return res.status(200).json({ msg: "language deleted successfullly" });
    console.log(deleteResponse);
  } catch (err) {
    return res.status(500).json({ msg: "something went wrong", err: err });
  }
};
