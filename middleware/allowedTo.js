const appError = require("../utils/appError");
const httpStatus = require('../utils/httpStatus')

const allowedTo = (...roles) => {

  return(req,res,next) => {
    if(!roles.includes(req.currentUser.role)){
      const error = appError.create("this role is not authorized" , 401 , httpStatus.FAIL);
      return next(error);
    }
    next();
  }
}
module.exports = allowedTo;