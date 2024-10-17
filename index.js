const express = require('express');
const cors = require('cors')
require('dotenv').config()

app = express()

app.use(cors());
app.use(express.json());

const dbConnect = require('./config/database');
dbConnect()

app.get('/',(req, res)=>{
    res.send('Hello World')
})

app.listen(process.env.PORT,(req, res)=>{
    console.log('Server is running at',process.env.PORT);
})
