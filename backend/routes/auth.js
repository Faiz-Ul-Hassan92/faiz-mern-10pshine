import express from 'express'
import User from '../models/user.js';
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer"
import logger from '../config/logger.js';

const router = express.Router();



router.get('/', (req,res) => {
    res.send("So far so good")
})

//route for registration
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
         if(!username || !email || !password) {
            logger.info("Missing fields in registration attempt")
            return res.status(400).json({message: "Please fill all the fields"})
         }
         const userExists = await User.findOne({email});
         const userNameExists = await User.findOne({username})
         if(userExists) {
            logger.warn({email}, "Registration attempt using an already registered email address")
            return res.status(400).json({message: "User already exists"})
         }
         if(userNameExists) {
            return res.status(400).json({message: "Username already exists"})
         }

         const user = await User.create({ username, email, password})
         const token = generateJWT(user._id)

         res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
         })
    }catch(err) {
        logger.error("Registration failure due to server error")
        res.status(500).json({message: "Server Error"})
    }
})


//updating password
router.put("/changingPassword", protect, async (req, res) => {
    const { password } = req.body

    try {
        if(!password) {
            return res.status(400).json({message:"Can't Update to an empty password"})
        }

        const user = await User.findById(req.user._id)

        user.password = password

        await user.save()

        logger.info( {email: user.email} , "Password Changed from profile page")
        return res.status(200).json({message:"Password updated successfully"})

    }catch(err) {
        logger.warn({email: req.user.email} , "Password Change attempt failed")
        res.status(500).json({message:"Server Error, Password unchanged."})
    }
})


//a route for forget password 
router.post("/forgetPassword", async (req, res) => {
    
    const { email } = req.body

    try {
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json({message:"User does not exist"})
        }

        const token = generateJWT(user._id, "10m")

        
        
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_APP_EMAIL,
        },
        });
        
        const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "10P Shine: Reset Password ",
        html: `<h1>Reset Your Password</h1>
        <p>Click on the following link to reset your password:</p>
        <h2><a href="http://localhost:5173/resetPassword/${token}">Reset Password</a></h2>
        <p>The link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>`,
        };

        
        transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return res.status(500).send({ message: err.message });
        }
        logger.info({email} , "Forget Password Sequence initiated")
        res.status(200).send({ message: "Email sent" });
        })


    }catch(err) {
        res.status(500).json({message:"Couldn't initiate the process. Try again."})
    }

})



router.post("/resetPassword/:token", async (req, res) => {
 

    try {
    const {newPassword} = req.body

    const token = req.params.token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch {
        logger.warn("Invalid token used for password reset attempt. Password reset failed.")
        return 
    }

    const user = await User.findById(decoded.id).select("-password")

    if(!user) {
        res.status(401).json({message:"User Not found, corrupted link"})
    }

    user.password = newPassword
    await user.save()

    logger.info({email: user.email} , "Password Changed using forget password sequence")
    res.status(200).json({message:"Password Changed. Log In with your new password."})

   } catch(err) {
    res.status(500).json({message:"Server Error, Password unchanged"})
   }
})




//router to login

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email})
        if(!user || !(await user.matchPassword(password))) {
            if(user) {
                logger.warn({email: user.email}, "Invalid Credentials used for login")
            }
            return res.status(401).json({message: "Invalid credentials"})
        }
        const token = generateJWT(user._id)
        logger.info({email: user.email}, "User logged in successfully")
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
        

    } catch(err) {
            logger.error("Login failure due to server error")
            res.status(500).json({message: "Server error"})

    }
})



//route to get user profile details

router.get("/profile", protect, async(req, res) => {
    res.status(200). json(req.user)
})



//JWT generator for users

const generateJWT = (id, expiresIn="30d") => {
    return jwt.sign( {id}, process.env.JWT_SECRET, {expiresIn})
}


export default router