const Admin = require("../../models/Admin");

exports.AllAdmin = async (req, res) => {
  try {
    const response = await Admin.find({}, { password: 0 });
    console.log(response);
    if (!response) {
      return res.status(200).json({ AdminList: [] });
    }
    return res.status(200).json({ AdminList: response });
  } catch (error) {
    return res.status(400).json({ err: error });
  }
};
