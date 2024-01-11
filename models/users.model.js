const mongoose = require('mongoose');
const validator = require('validator')
const userRoles = require('../utils/userRoles');

const usersSchema = mongoose.Schema({
  fristName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    validate:[validator.isEmail,"filed must be a valid email adress"]
  },
  password:{
    type:String,
    required:true
  },
  token:{
    type:String
  },
  role:{
    type:String,
    enum:[userRoles.USER, userRoles.ADMIN, userRoles.MANGER],
    default:userRoles.USER
  },
  avatar:{
    type:String,
    default:'uploads/profile.jpg',
  }
});

const usersModel = mongoose.model('User' , usersSchema);

module.exports ={
  User:usersModel
}