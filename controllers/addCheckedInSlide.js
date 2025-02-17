const checkInpoints = require("../models/checkInPoints");

exports.addCheckedInSlide = async (req, res) => {
  console.log(req.body);
  const {
    start,
    end,
    title,
    allocatedPoints,
    pointAllocationType,
    increaseBy,
    dayPattern,
  } = req.body;
  if (isNaN(Number(end))) {
    console.log("activated");
    return res.status(404).json({ msg: "end column can only contains number" });
  }
  if (Number(end) <= 0) {
    console.log("activated");
    return res
      .status(404)
      .json({ msg: "end column can not be 0 and negative..." });
  }
  if (isNaN(allocatedPoints)) {
    console.log("activated");
    return res
      .status(404)
      .json({ msg: "reward points column can only contains number" });
  }
  if (allocatedPoints <= 0) {
    console.log("activated");
    return res
      .status(404)
      .json({ msg: "reward points column can not be 0 and negative..." });
  }
  if (pointAllocationType == "Step" && isNaN(Number(increaseBy))) {
    console.log("activated");
    return res
      .status(404)
      .json({ msg: "increase points column can only contains number" });
  }
  if (pointAllocationType == "Step" && Number(increaseBy) <= 0) {
    console.log("activated");
    return res
      .status(404)
      .json({ msg: "increase points column can not be 0 and negative..." });
  }
  if (pointAllocationType == "Step" && isNaN(Number(dayPattern))) {
    console.log("activated");
    return res
      .status(404)
      .json({ msg: "On every column can only contains number" });
  }
  if (pointAllocationType == "Step" && Number(dayPattern) <= 0) {
    return res
      .status(404)
      .json({ msg: "On every column can not be 0 and negative..." });
  }
  try {
    let nextIncrementStart = +start + +dayPattern;
    let pointsAllocating = +allocatedPoints;
    for (let day = +start; day < +start + +end; day++) {
      if (day == nextIncrementStart) {
        nextIncrementStart = nextIncrementStart + +dayPattern;
        pointsAllocating += +increaseBy;
      }
      const response = await checkInpoints.create({
        Day: day,
        title,
        allocatedPoints: pointsAllocating,
      });
    }
    return res.status(200).json({ msg: "checked-In slides Added" });
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ msg: "something went wrong",err:error });
  }
};
