const { Mongoose, default: mongoose } = require("mongoose");
const Movies = require("../models/Movies");

module.exports = async (req, res, next) => {
  //   console.log(req.body);
  //   if (req.body.length == 0) {
  //     return res.status(400).json({ msg: "no sequence  selected" });
  //   }
  const sequenceArray = req.body.sequenceData;
  const moviesId = req.body.moviesId;
  console.log(sequenceArray);
  //   return;
  try {
    // const promises = sequenceArray.map();
    const moviesResponse = await Movies.findById(
      { _id: moviesId },
      { shorts: 1 }
    );
    console.log(moviesResponse.shorts);
    if (moviesResponse.shorts.length === 0) {
      return res.status(400).json({ msg: "no data for sequencing" });
    }
    const shortsOldDataMap = new Map();

    moviesResponse.shorts.forEach((currentKey, index) => {
      if (shortsOldDataMap.has(currentKey.toString())) {
        shortsOldDataMap.set(
          currentKey.toString(),
          shortsOldDataMap.get(currentKey.toString()) + 1
        );
      } else {
        shortsOldDataMap.set(currentKey.toString(), 1);
      }
    });
    // console.log(shortsOldDataMap.size);
    // return
    sequenceArray.forEach((current) => {
      console.log(current);
      if (shortsOldDataMap.size == 0) {
        throw new Error(
          "can not perform sequence changing because your data content duplicates entries found"
        );
      }
      //   return
      if (current === "Ads") {
        const value = shortsOldDataMap.get(current);
        if (!value) {
          throw new Error(
            "can not perform sequence changing because your data content duplicates ads id"
          );

          // return res.status(400).json({msg:"can not perform sequence changing "})
        }
        if (value > 1) {
          shortsOldDataMap.set(current, shortsOldDataMap.get(current) - 1);
        } else {
          shortsOldDataMap.delete(current);
        }
      } else {
        const value = shortsOldDataMap.get(current);
        console.log(value);
        if (!value) {
          throw new Error(
            "can not perform sequence changing because your data content duplicates movies id"
          );

          // return res.status(400).json({msg:"can not perform sequence changing "})
        }
        if (value > 1) {
          shortsOldDataMap.set(current, shortsOldDataMap.get(current) - 1);
        } else {
          shortsOldDataMap.delete(current);
        }
      }
    });
    console.log(sequenceArray, "ads");
    // return
    // const updatedShorts = sequenceArray.map((current) => {
    //     if (current === "Ads") {
    //       return current; // Leave "Ads" as is
    //     } else {
    //       return new mongoose.Types.ObjectId(current); // Convert to ObjectId
    //     }
    //   });
  
      // Update the shorts field
      moviesResponse.shorts = sequenceArray;
    // .map(current=>{
    //     if(current==="Ads"){
    //         return "Ads"
    //     }
    //     else{
    //        new mongoose.Types.ObjectId(current)
    //     }
    // });
    moviesResponse.save();
    // const response = await Shorts.updateMany(
    //   { _id: { $in: req.body } }, // Find documents where _id is in the array
    //   { $set: { visible: false } }, // Update the 'status' field
    //   { multi: true }
    // );
    return res.status(200).json({ msg: "modified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "something went wrong", error });
  }
};
