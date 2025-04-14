const Shorts = require("../../models/Shorts");

exports.setShortsDeductionPoints = async (req, res) => {
  console.log(req.body, "uudyuwed");
  //   return;
  const dataArray = Object.entries(req.body);
  console.log(dataArray.length)
  if (!dataArray||dataArray.length==0) {
    return res.status(400).json({ msg: "no id selected" });
  }

  try {
    const updatePromises = dataArray.map(([id, value]) => {
        console.log("Updating:", id, value);
        return Shorts.updateOne(
          { _id: id },
          { $set: { deductionPoints: +value } }
        );
      });
  
      await Promise.all(updatePromises);
    return res.status(200).json({ msg: "modified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "something went wrong", error });
  }
};
