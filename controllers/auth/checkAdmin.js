const Admin = require("../../models/Admin");

exports.checkAdmin = async (req, res,next) => {
  console.log(req.Admin);
  const adminResponse = await Admin.findOne({
    _id: req.Admin._id,
    name: req.Admin.name,
    email: req.Admin.email,

  });
  if(!adminResponse){
    return res.status(400).json({msg:"invalid admin"})
  }
  next();
};
