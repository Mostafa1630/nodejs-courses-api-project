const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  }
});

const courseModel = mongoose.model('Course' , courseSchema);

module.exports ={
  Course:courseModel
}