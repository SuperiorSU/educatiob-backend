
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.auth = (req,res,next) =>{
    try{
        // check if token is there or not
        // the best way to send the token is in the headers. But we can also send the token in the body or in the cookies. We can send the token in the body using the following method
        console.log("req.body.token = ",req.body.token);
        console.log("req.cookies.token = ",req.cookies);
        // console.log("req.header = ",req.header("Authorization"));
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ",""); 

        // we are replacing "Bearer " (with space) with a blank string so that only token is the resultant 

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token not found"
            });
        }

        // verify the token
        try{
            // to verify, we use the verify method of jwt which takes two parameters, token and secret key
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            
            // if token is verified, we set the user in the request object. We store the user in the decoded object so that we can verify the user in the next middleware
            req.user = decoded;
            next();
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Something is wrong with the code"
        })
    }
}

exports.isTeacher = async (req, res, next) => {
    try{
        if(req.teacher.role!=="teacher"){
            return res.status(400).json({
                success: false,
                message: "You are not authorized to access this route"
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}