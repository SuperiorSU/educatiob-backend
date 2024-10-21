const teacherSchema = require("../model/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();



exports.teacherSignUp = async (req, res) => {
  try {
    // get data
    const { name, email, password, dob, specialization,profileImg, address } = req.body;
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
      profileImg,
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
exports.teacherLogin = async (req, res) => {
  try {
    // Get data from request body
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if the teacher exists in the database
    let teacher = await teacherSchema.findOne({ email });
    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Prepare the payload for the JWT token
    const payload = {
      email: teacher.email,
      id: teacher._id,
      role: teacher.role,
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h", // Token valid for 2 hours
    });

    // Remove the password from the teacher object before sending it to the client
    teacher = teacher.toObject();
    teacher.token = token;
    teacher.password = undefined;

    // Create cookie options
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie valid for 3 days
      httpOnly: true, // Make the cookie accessible only by the web server
    };

    // Set the token in the cookie and respond with teacher details and token
    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      teacher,
      message: "Teacher logged in successfully",
    });
  } catch (err) {
    console.error("Error during teacher login:", err);
    return res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};
