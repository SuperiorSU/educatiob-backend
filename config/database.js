const mongoose = require('mongoose');

// Connect to MongoDB
require('dotenv').config();
const connectDb=async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_URL)
        console.log('Connected to MongoDB');    
    }
    catch(err){
        console.log('Something went wrong', err);
    }

    
}
// npm i dotenv
module.exports=connectDb;