const Movies = require("../models/Movies");
const Users = require("../models/Users");

exports.getAllUsers = async (req, res, next) => {
  const { start, limit, searched} = req.query;
  
 
  console.log(start, limit, searched);

  let filter = {};
  try {
    if (searched && searched.trim() !== "") {
      filter = {
        $or: [
          { name: { $regex: searched, $options: "i" } },
          { email: { $regex: searched, $options: "i" } },
        ],
      };
    }
    const totalUsersCount = await Users.countDocuments(filter)
    
    const allUsers = await Users.find(filter).select("name email")  .skip(limit * start)
      .limit(limit);;


    return res.status(200).json({
      allUsers,
      start,
      limit,
      totalData: totalUsersCount,
      totalPages: Math.ceil(totalUsersCount / limit),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something went wrong", err: err });
  }
};
