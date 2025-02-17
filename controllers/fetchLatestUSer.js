const Users = require("../models/Users");

exports.fetchLatestUser = async (req, res, next) => {
  const { type } = req.params;
  let matchCondition = {};
  try {
    if (type === "Month") {
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );
      matchCondition.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (type === "Year") {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const endOfYear = new Date(new Date().getFullYear(), 11, 31);
      matchCondition.createdAt = { $gte: startOfYear, $lte: endOfYear };
    } else if (type !== "All") {
      return res.status(400).json({ message: "Invalid type parameter" });
    }

    const userData = await Users.find(matchCondition, {
      _id: 1,
      name: 1,
      email: 1,
      mobile: 1,
    })
      .sort({ views: 1 }) // Sort by views in descending order
      .limit(10);
      console.log(userData)
    if (userData.length === 0) {
      return res.status(404).json({
        users: [],
        message: "No users found for the given criteria",
      });
    }
    res.status(200).json({ users: userData });
  } catch (error) {
    console.log(error);
   return res.status(500).json({ message: "Server error", error });
  }
};
