const express = require('express');
const route = express.Router();
const {studentSignUp, studentLogin} = require('../controllers/studentContoller');
const {teacherSignUp} = require('../controllers/teacherController');

// student
route.post('/studentSignup',studentSignUp);
route.get('/studentLogin',studentLogin);



// teachers
route.post('/teacherSignup',teacherSignUp)


module.exports = route;