const { json } = require('express');
const warpperCourse = require('../middleware/wrapperCourse');
const {User} = require('../models/users.model');
const appError = require('../utils/appError');
const httpStatus = require("../utils/httpStatus");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const genrateToken = require('../utils/genrateToken');


const getAllUser = warpperCourse(
  async(req, res) => {
    // console.log(req.headers['authorization']);
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page -1) * limit;

    let users = await User.find({},{"__v":false , "password":false}).limit(limit).skip(skip);
    res.json({status : httpStatus.SUCCESS,data:{users}});
  }
);

const register = warpperCourse(async(req,res,next)=> {
  const {fristName,lastName,email,password,role,avatar} = req.body;
  
  // Check If Email Duclicked
  const oldUser = await User.findOne({email: email});
  
  if(oldUser){
    const error = appError.create("user already exists",400,httpStatus.ERROR)
      return next(error);
  }

  // To bycrpt or hased password
  const hashedPassword =await bcrypt.hash(password,8);

  const newUser = new User({fristName,lastName,email,password:hashedPassword,role,avatar:req.file.filename});
    // Genrate Token
  const token = await genrateToken({email:newUser.email , id:newUser._id ,role:newUser.role});
  newUser.token = token;

  await newUser.save();
  res.status(201).json({status : httpStatus.SUCCESS,data:{user:newUser}});
});

const login = warpperCourse(async(req,res,next)=> {
  const {email,password} = req.body ;

  if(!email && !password){
    const error = appError.create("email and password already required" , 400 , httpStatus.FAIL);
    return next(error);
  }

  const user = await User.findOne({email:email});
  if(!user){
    const error = appError.create("User Not Found" , 400 , httpStatus.FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password,user.password);

  if(user && matchedPassword){
    // User Logged In Successfuly
    const token = await genrateToken({email:user.email , id:user._id ,role:user.role});
    return res.status(201).json({status : httpStatus.SUCCESS,data:{token}})
  }else{
    const error = appError.create("something worng" , 500 , httpStatus.FAIL);
    return next(error);
  }
});


module.exports ={
  getAllUser,
  register,
  login
}