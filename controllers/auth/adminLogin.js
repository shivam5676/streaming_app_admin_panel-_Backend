const Admin = require("../../models/Admin");

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("object");

  try {
 
    const AdminLoginResponse = await Admin.findOne({
      email: email,
      password: password,
    });
    if (!AdminLoginResponse) {
      return res.status(400).json({
        msg: "not logged in",
        status: false,
      });
    }
    return res.status(200).json({
      msg: "logged in",
      status: true,
      userData: AdminLoginResponse,
      accessToken: "",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "something went wrong....",
      err: error,
    });
  }
};
