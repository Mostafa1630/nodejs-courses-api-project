const express = require('express');
const router = express.Router();
const coursesController = require('../controller/courses.controller');
const { validation } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verfiyToken');
const userRoles = require('../utils/userRoles');
const allowTo = require('../middleware/allowedTo')
router.route('/')
.get(verifyToken,coursesController.getAllCourse )
.post(
validation(),verifyToken,
allowTo(userRoles.MANGER), coursesController.addCourse )


router.route('/:courseid')
.get(coursesController.getCourse)
.patch(coursesController.updateCourse)
.delete(verifyToken,allowTo(userRoles.ADMIN,userRoles.MANGER),coursesController.deleteCourse);


module.exports = router;