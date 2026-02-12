import User from "../models/user.js";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

//I generated it using nodes crypto library's random generator

export const protect = async (req, res, next) =>{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
             token = req.headers.authorization.split(" ")[1];

             const decoded = jwt.verify(token, process.env.JWT_SECRET)

             req.user = await User.findById(decoded.id).select("-password") //we dont need the password

             return next();
        } catch(err) {
            console.error("Token verification failed", err.message)
            logger.warn( {url: req.originalUrl, error: err.message} , "Token Verification Failed")
            return res.status(401).json({message: "Not authorized, token failed"})
        }
    }
    logger.warn( {url: req.originalUrl} , "Unauthorized Access attempted")
    return res.status(401).json({message: "Not authorized, token failed"})
}




//this sort of a token to be sent 
//Authorization: Bearer <token> 