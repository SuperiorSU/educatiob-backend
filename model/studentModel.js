const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        default: 'annonymous'
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
    standard:{
        type:String,
        required: true,
        enum: ['IX', 'X', 'XI', 'XII']
    },
    address:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    role:{
        type: String,
        default: 'student'
    },
    token: {
        type: String,
    },
    
},{timestamps:true})

module.exports = mongoose.model('studentSchema',studentSchema );