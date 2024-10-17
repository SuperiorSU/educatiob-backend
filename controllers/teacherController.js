const mongoose = require('mongoose');
const teacherSchema = require('../model/teacherModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken') 

exports.teacherSignUp = async (req, res) => {
    try {
      // get data
      const { name, email, password,dob, specialization, address} = req.body;
      // check if teacher already exist
      const existingteacherSchema = await teacherSchema.findOne({ email });
      if (existingteacherSchema) {
        return res.status(400).json({
          success: false,
          message: "teacher Already Exist",
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
  
      // create teacher entry
       await teacherSchema.create({
        name,
        email,
        specialization,
        password: hashedPassword,
        dob,
        address,
      });
  
      return res.status(200).json({
        success: true,
        message: "teacherSchema created successfully",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  };