const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");

exports.registerAdmin = async (req, res, next) => {
  const { name, email } = req.body;
  console.log(name, email);
  if (!name) {
    return res.status(400).json({ msg: "please add name field" });
  }
  if (!email) {
    return res.status(400).json({ msg: "please add email field" });
  }

  // const encryptedPassword =await bcrypt.hash(password, 10);
  //   console.log(encryptedPassword)
  //   return;
  //   jwt.sign(password, "shivamssr");
  //   console.log(encryptedPassword);
  try {
    const checkUniqueEmail = await Admin.findOne({ email: email });
    if (checkUniqueEmail) {
      return res.status(400).json({
        msg: "Email already registered...",
        status: false,
      });
    }
    const AdminSignupResponse = await Admin.create({
      name: name,
      email: email,
      status: "Pending",
      // password: encryptedPassword,
    });
    if (!AdminSignupResponse) {
      return res.status(400).json({
        msg: "not signed up",
        status: false,
      });
    }
    // we have to send the user registeration link over the email and we have to create a route so that when user clicks on that link in frontend they will get a form for inputing password
    return res.status(200).json({
      msg: "Email has been sent to the registered email please verify it and register password there",
      status: true,
      //   userData: AdminSignupResponse,
      // accessToken: "",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "something went wrong....",
      err: error,
    });
  }
};
