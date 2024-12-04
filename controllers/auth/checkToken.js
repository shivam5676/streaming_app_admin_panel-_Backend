const { verifyToken } = require("./verifyToken");

exports.checkToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  console.log(req.headers["authorization"]);
  if (!token) {
    return res.status(400).json({ msg: "please provide token" });
  }
  try {
    const userDetails = await verifyToken(token, "shivamssr");
    req.Admin = userDetails;
    // console.log(userDetails);
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "something went wrong", err: error });
  }
};
