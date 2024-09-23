const path = require("path");
const fs = require("fs");
const language = require("../models/language");
exports.addLanguage = async (req, res, next) => {
  const name = req.body.language;
  if(!name){
    return res
    .status(400)
    .json({ msg: "no language found in input field" });
  }
console.log(name)
  try {
    const savedLanguage = await language.create({
      name: name,
    });
    if (!savedLanguage) {
      return res
        .status(400)
        .json({ msg: "err while saving the Language.plz try again..." });
    }
    return res.status(200).json({ language: savedLanguage });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};
