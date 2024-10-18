const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
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
    role:{
        type:String,
        default: 'admin'
    }   
})

module.exports = mongoose.model('adminSchema',adminSchema );