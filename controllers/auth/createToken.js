const jwt = require("jsonwebtoken");

exports.createToken = (data) => {
  const token = jwt.sign(data, "shivamssr");
  return token;
};