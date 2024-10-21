const studentSchema = require('../model/studentModel');
const bcrypt = require('bcrypt');
const OTP = require('../model/otpModel');
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken')


// Student Sign-Up Handler
exports.studentSignUp = async (req, res) => {
    try {
        // Get data from request body
        const { name, email, password, dob, city, standard, address } = req.body;

        // Check if student already exists
        const existingStudent = await studentSchema.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: "Student Already Exists",
            });
        }

        // Secure the password using bcrypt
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: "Cannot Hash the password",
            });
        }

        // Create student entry
        await studentSchema.create({
            name,
            email,
            password: hashedPassword,
            city,
            role: "student",
            dob,
            address,
            standard
        });

        return res.status(200).json({
            success: true,
            message: "Student created successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Student Login Handler
exports.studentLogin = async (req, res) => {
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

        // Check if the student exists in the database
        const student = await studentSchema.findOne({ email });
        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Student not found",
            });
        }

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Generate OTP if the password is valid
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP GENERATED SUCCESSFULLY");

        // Ensure the OTP is unique in the database
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        // Create an entry for the OTP in the database
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        console.log("DB ENTRY FOR OTP CREATED");
        console.log(otpBody);

        // Generate JWT token
        const payload = {
            email: student.email,
            id: student._id,
            role: student.role,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "10h",
        });

        // Set the token in the student's record
        student.token = token;
        student.password = undefined; // Exclude the password from the response

        // Create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
        };
        
        // Send OTP, token, and student info
        res.cookie("token", token, options).status(200).json({
            success: true,
            message: "OTP sent successfully, Logged in",
            token,
            student,
        });

    } catch (err) {
        console.error("ERROR WHILE SENDING OTP:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



// Update Student Profile
exports.updateStudentProfile = async (req, res) => {
  try {
    // Data fetch
    const { dob, city, address } = req.body; // Adjusted to match schema fields
    const id = req.student._id; // Assume user ID is available in req.user.id

    // Data validate
    if (!dob || !city || !address || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Find student
    const studentDetails = await studentSchema.findById(id);
    if (!studentDetails) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update student profile
    studentDetails.dob = dob;
    studentDetails.city = city;
    studentDetails.address = address;

    const updatedDetails = await studentDetails.save();

    // Return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedDetails: updatedDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Couldn't update profile, please try again",
      error: err.message,
    });
  }
};