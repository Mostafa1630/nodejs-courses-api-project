// let courses = require("../data/courses"); // From Data Static File
const { validationResult} = require('express-validator');

const {Course} = require("../models/courses.model");
const httpStatus = require("../utils/httpStatus");
const warpperCourse = require('../middleware/wrapperCourse');
const appError = require('../utils/appError');


const getAllCourse = warpperCourse(
  async(req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page -1) * limit;
    let courses = await Course.find({},{"__v":false}).limit(limit).skip(skip);
    res.json({
      status : httpStatus.SUCCESS,
      data : {
        courses
      }
    });
  }
);

const getCourse = warpperCourse(
  async (req, res , next) => {
    const corsedId = req.params.courseid;
    
    let course = await Course.findById(corsedId ,{"__v":false});
    if (!course) {
      const error = appError.create("course not found",404,httpStatus.FAIL)
      return next(error);
      // return res.status(404).json({  status : httpStatus.FAIL, data:{course:null}});
    }
    return res.json({status : httpStatus.SUCCESS , data : {course}});
  }
);

const addCourse = warpperCourse(
  async (req, res , next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = appError.create(errors.array(),400,httpStatus.ERROR)
      return next(error);
    }
  
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({  status : httpStatus.SUCCESS , data:{course : newCourse}});
  }
);

const updateCourse = warpperCourse(
  async (req, res) => {
    const courseId =req.params.courseid;
    // let course = courses.find((el) => el.id === courseId);
    
      let updateCourse = await Course.updateOne({_id:courseId} ,{$set:{...req.body}});
      return res.status(200).json({  status : httpStatus.SUCCESS,data:{course:updateCourse}});
  }
);

const deleteCourse = warpperCourse(
  async (req, res) => {
    // const courseId = req.params.courseid;
  
    // courses = courses.filter((el) => el.id !== courseId);
    const data = await Course.deleteOne({_id: req.params.courseid})
  
    res.status(200).json({status : httpStatus.SUCCESS, data:null });
  }
);

const notFoundResource = (req ,res , next) => {
  return res.status(404).json({
    status : httpStatus.ERROR,
    message:"this resource is not avalible"
  })
};

module.exports = {
  getAllCourse,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
  notFoundResource
}