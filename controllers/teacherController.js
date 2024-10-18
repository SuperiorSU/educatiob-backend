const teacherSchema = require("../model/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();



exports.teacherSignUp = async (req, res) => {
  try {
    // get data
    const { name, email, password, dob, specialization, address } = req.body;
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
      hashedPassword = await bcrypt.hash(password, 10);
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
      role: "teacher",
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


exports.teacherLogin = async (req, res) => {
  try {
    // get data
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // check if the teacher is available
    let teacher = await teacherSchema.findOne({ email });
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // check if the password is valid
    if (await bcrypt.compare(password, teacher.password)) {
      // Prepare the payload for JWT token
      const payload = {
        email: teacher.email,
        id: teacher._id,
        role: teacher.role,
      };

      // Generate the JWT token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h", // Token valid for 2 hours
      });

      // Remove the password from the teacher object before sending it to the client
      teacher = teacher.toObject();

      teacher.token = token;
      teacher.password = undefined;

      // Create cookie options
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days expiration
        httpOnly: true, // Cookie accessible only by the web server
      };

      // Set the token in the cookie and respond with the teacher details and token
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        teacher,
        message: "Teacher logged in successfully",
      });
    } else {
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
