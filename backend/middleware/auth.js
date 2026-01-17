import User from "../models/user.js";
import jwt from "jsonwebtoken";

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
            return res.status(401).json({message: "Not authorized, token failed"})
        }
    }
    return res.status(401).json({message: "Not authorized, token failed"})
}




//this sort of a token to be sent 
//Authorization: Bearer <token> 