const Admin = require("../../models/Admin");

exports.AllAdmin = async (req, res) => {
  const { start, limit, searched = "" } = req.query;
  console.log(start, limit, searched);

  let filter = {};
  try {
    if (searched && searched.trim() !== "") {
      filter = {
        $or: [{ name: { $regex: searched, $options: "i" } }, { email: { $regex: searched, $options: "i" } }],
      };
    }
    const totalAdminCount = await Admin.countDocuments(filter);
    const response = await Admin.find(filter, { password: 0 }).skip(limit * start)
      .limit(limit);
    console.log(response);
    if (!response) {
      return res.status(200).json({
        AdminList: [], 
      });
    }
    return res.status(200).json({ AdminList: response , start,
      limit,
      totalData: totalAdminCount,
      totalPages: Math.ceil(totalAdminCount / limit),});
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};