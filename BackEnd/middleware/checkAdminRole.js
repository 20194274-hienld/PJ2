const { Admin } = require('../model/user');
const jwt = require("jsonwebtoken");

const checkAdminRole = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.json({status:'fail', msg: "Token required!" })
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.json({msg:"you need to login first"})
  }
  jwt.verify(token, "lehien2001",function(err,decodedToken) {
    if(err){
      return res.json({status:'fail',msg:"Invalid token"})
    }
    console.log("admin " + decodedToken.userID);
    Admin.findOne({ _id: decodedToken.userID},function(err,doc){
        if(err){
          return res.json({status:'fail',msg:'Server error!'})
        }else if(!doc){
          return res.json({status:'fail',msg:'Admin role needed!'})
        }
        next();
    });
  });
}
module.exports = checkAdminRole;