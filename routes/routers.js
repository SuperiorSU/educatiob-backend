const express = require('express');
const route = express.Router();
const {studentSignUp, studentLogin, updateStudentProfile} = require('../controllers/studentContoller');
const {teacherSignUp, teacherLogin} = require('../controllers/teacherController');
// const {isTeacher, auth} = require('../middlewares/authentication');
const { getAllTeachers, getTeacher, getAllStudent, getStudent, deleteTeacher, deleteStudent } = require('../controllers/adminControlller');

// student
route.post('/studentSignup',studentSignUp);
route.get('/studentLogin',studentLogin);
route.put('/updateStudent/:id',updateStudentProfile)
// teachers
route.post('/teacherSignup',teacherSignUp)
route.get('/teacherLogin',teacherLogin)

// admin

route.get('/getAllTeachers',getAllTeachers)
route.get('/getTeacher/:id',getTeacher)
route.delete('/deleteTeacher/:id', deleteTeacher);

route.get('/getAllStudents',getAllStudent);
route.get('/getStudent/:id',getStudent);
route.get('/deleteStudent/:id', deleteStudent);


module.exports = route;