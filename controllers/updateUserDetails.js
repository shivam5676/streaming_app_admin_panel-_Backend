const Users = require("../models/Users");

exports.updateUserDetails = async (req, res) => {
  try {
    const { updatedData, type, userId } = req.body;

    if (type === "mobile" && (isNaN(updatedData) || updatedData.length != 10)) {
      return res.status(400).json({ msg: "Please provide valid mobile no" });
    }
    if (type === "email" && !updatedData.includes("@")) {
      return res.status(400).json({ msg: "Please provide valid email id" });
    }
    if (!userId) {
      return res.status(400).json({ msg: "invalid user" });
    }
    if (type === "email" || type === "mobile" || type === "name") {
      try {
        const userResponse = await Users.findOneAndUpdate(
          { _id: userId },
          { [type]: updatedData },{new:true}
        );
        return res
        .status(200)
        .json({ data: userResponse });
      } catch (error) {}
    } else {
      return res
        .status(402)
        .json({ msg: "you can not edit restricted content" });
    }
  } catch (error) {
    return res.status(500).json({ msg: err });
  }
};
