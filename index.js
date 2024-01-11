require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const httpStatus = require("./utils/httpStatus");
const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
  console.log("server started");
})

app.use(cors());






const bodyParser = require('body-parser');

const coursesRouter = require('./routes/courses.route')
const usersRouter = require('./routes/users.route');
const path = require('path');
const { notFoundResource } = require('./controller/courses.controller');
app.use(bodyParser.json());
// app.use(express.json());

app.use('/api/courses' , coursesRouter);  //api for courses
app.use('/api/users' , usersRouter);   //api for users
app.use('/uploads',express.static(path.join(__dirname,'uploads'))); //to diaplay profile image

app.all('*' , notFoundResource);

app.use((error,req,res,next) => {
  res.status( error.statusCode || 500).json({  status :error.statusText || httpStatus.ERROR, data:null , message:error.message ,code:error.statusCode || 500});
})






app.listen( process.env.PORT || "4000" , () => {
  console.log('Project Listen In Port :: 4000');
})