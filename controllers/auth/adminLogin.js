const Admin = require("../../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createToken } = require("./createToken");
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  // const verifyToken = (token, secretKey) => {
  //   return new Promise((resolve, reject) => {
  //     jwt.verify(token, secretKey, (err, decoded) => {
  //       if (err) {
  //         reject(err); // Reject the Promise with the error
  //       } else {
  //         resolve(decoded); // Resolve the Promise with the decoded payload
  //       }
  //     });
  //   });
  // };
  try {
    const AdminLoginResponse = await Admin.findOne({
      email: email,
    });

    // return
    if (!AdminLoginResponse) {
      return res.status(400).json({
        msg: "not logged in",
        status: false,
      });
    }
    const hashedPassword = AdminLoginResponse.password;
    const passwordVerified = await bcrypt.compare(password, hashedPassword);

    if (!passwordVerified) {
      return res.status(400).json({ msg: "password is wrong " });
    }
    const data = {
      _id: AdminLoginResponse._id,
      name: AdminLoginResponse.name,
      email: AdminLoginResponse.email,
    };
    const token = createToken(data);
    return res.status(200).json({
      msg: "logged in",
      status: true,
      token: token,
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
