const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        default: 'Teacher'
    },
    bio:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    profileImg:{
        type: String,
        
    },
    dob:{
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
        enum:["Chandigarh", "Pune", "Bangalore", "Chennai", "New Delhi"],
    },
    specialization:{
        type:String,
        required: true,
        enum: ['Chemistry', 'Computer Science', 'Physics', 'Maths','Biology','English']
    },
    address:{
        type: String,
        required: true,
    },
    
},{timestamps:true})

module.exports = mongoose.model('teacherSchema',teacherSchema );