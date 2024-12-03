const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const verifyToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          reject(err); // Reject the Promise with the error
        } else {
          resolve(decoded); // Resolve the Promise with the decoded payload
        }
      });
    });
  };
  try {
    bcrypt.compare(data:password)
    // const decryptedPassword = await verifyToken(password, "shivamssr");
    // console.log(decryptedPassword);
    // return;
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
    console.log(error);
    return res.status(500).json({
      msg: "something went wrong....",
      err: error,
    });
  }
};
