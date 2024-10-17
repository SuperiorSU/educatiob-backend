const mongoose = require('mongoose');
const studentSchema = require('../model/studentModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') 

exports.studentSignUp = async (req, res) => {
    try {
      // get data
      const { name, email, password,dob, city, standard, address } = req.body;
      // check if student already exist
      const existingstudentSchema = await studentSchema.findOne({ email });
      if (existingstudentSchema) {
        return res.status(400).json({
          success: false,
          message: "Student Already Exist",
        });
      }
      // secure password
      // now .hash() takes two parameters(three actually), the value that is to be hashed and number of rounds and third is a callback function
      let hashedPassword;
      try {
        hashedPassword=await bcrypt.hash(password, 10);
      } catch (err) {
        return res.status(500).json({
          success: false,
          message: "Cannot Hash the password",
        });
      }
  
      // create student entry
       await studentSchema.create({
        name,
        email,
        password: hashedPassword,
        city,
        dob,
        address,
        standard
      });
  
      return res.status(200).json({
        success: true,
        message: "studentSchema created successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };

  exports.studentLogin = async(req, res)=>{
    try {
      // get data
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }
      // check if the student is available
      let student = await studentSchema.findOne({ email });
      if (!student) {
        return res.status(401).json({
          success: "false",
          message: "student not found",
        });
      }
      
      
      if (await bcrypt.compare(password, student.password)) {
        return res.status(200).json({
          success: true,
          message: "User is found and the data is valid"
        })
        
        }
      else {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Login failed",
      });
    }
  };