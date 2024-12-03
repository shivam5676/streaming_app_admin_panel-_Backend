const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");

exports.registerAdmin = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);
  if (!name) {
    return res.status(400).json({ msg: "please add name field" });
  }
  if (!email) {
    return res.status(400).json({ msg: "please add email field" });
  }
  if (!password) {
    return res.status(400).json({ msg: "please add password field" });
  }
  if (!confirmPassword) {
    return res.status(400).json({ msg: "please add confirm password field" });
  }
  if (password != confirmPassword) {
    return res
      .status(400)
      .json({ msg: "please add same password and confirm password" });
  }
  const encryptedPassword =await bcrypt.hash(password, 10);
//   console.log(encryptedPassword)
//   return;
//   jwt.sign(password, "shivamssr");
//   console.log(encryptedPassword);
  try {
    const checkUniqueEmail = await Admin.findOne({ email: email });
    if (checkUniqueEmail) {
      return res.status(400).json({
        msg: "Unique email needed",
        status: false,
      });
    }
    const AdminSignupResponse = await Admin.create({
      name: name,
      email: email,
      password: encryptedPassword,
    });
    if (!AdminSignupResponse) {
      return res.status(400).json({
        msg: "not signedup",
        status: false,
      });
    }
    return res.status(200).json({
      msg: "successfully signed up",
      status: true,
      //   userData: AdminSignupResponse,
      accessToken: "",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "something went wrong....",
      err: error,
    });
  }
};
