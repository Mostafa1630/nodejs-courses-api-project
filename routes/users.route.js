const express = require('express');
const router = express.Router();
const usersController = require('../controller/users.controller');
const verifyToken = require('../middleware/verfiyToken');
const multer  = require('multer');
const appError = require('../utils/appError');

const storage = multer.diskStorage({
  destination:(req,file,cd)=>{
    cd(null,'uploads');
  },
  filename:(req,file,cb)=>{
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${Date.now()}.${ext}`
    cb(null,fileName);
  }  
})
const fileFliter = (req,file,cd) =>{
  const imgType = file.mimetype.split('/')[0];
  if(imgType === "image"){
    return cd(null,true);
  }else{
    return cd(appError.create("this file must be image",400),false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter:fileFliter
});

router.route('/').get(verifyToken,usersController.getAllUser)
router.route('/register').post(upload.single('avatar') ,usersController.register)
router.route('/login').post(usersController.login)




module.exports = router;