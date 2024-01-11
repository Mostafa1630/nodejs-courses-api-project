const appError = require("../utils/appError");
const httpStatus = require('../utils/httpStatus')
const jwt = require('jsonwebtoken');
const wrapperCourse = require("./wrapperCourse");

const verifyToken = 
  (req,res,next) =>{
    const authorization = req.headers['Authorization'] || req.headers['authorization'];
    if(!authorization){
      const error = appError.create('token is required',401,httpStatus.ERROR);
      next(error);
    }
    const token = authorization.split(' ')[1];
    try{
      const currentUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
      req.currentUser = currentUser;
      next();
    }catch(e){
      const error = appError.create(e.message,401,httpStatus.ERROR);
      next(error);
    }
}
module.exports = verifyToken;