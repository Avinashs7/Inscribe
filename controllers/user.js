const User=require('../models/users')
const transporter=require('../config/nodemailer');
const { generateToken } = require('../services/authentication');

function otpgenerator(){
    return Math.floor(100000+Math.random()*900000).toString();
}

const handleOtp=(req,res)=>{
    return res.render("otp")
}

const addUser=async(req,res)=>{
    //Accepts the user data and stores it. Password is hashed inside models itself.
    const {fullName,email,password,profile}=req.body;
        const otp=otpgenerator();
        const mailOptions={
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification OTP',
            text: `Your OTP for email verification is ${otp}. It will expire in 5 minutes.`
        }
    const user=await User.create({
        fullName,email,password,profile,otp    
    });
    const token=generateToken(user);
    res.cookie("token",token)
    try{
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Error sending OTP email');
            }
            return res.status(200).redirect('/user/verify');
        });
        } 
    catch (error) {
        console.error(error)
        return res.status(500).send('Error registering user');
    }
    
    // console.log(user)
 }

 const handleValidation=async (req,res)=>{
    const { otp } = req.body;
    const email=req.user?.email;
    // console.log(email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }
        if (user.otp !== (otp)) {
            return res.status(400).send('Invalid OTP');
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).send('OTP has expired');
        }
        user.isValidated = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        return res.status(200).redirect('/');
    } catch (error) {
        return res.status(500).send('Error verifying OTP');
    }
 }

 const isUser=async (req,res)=>{
    const {email,password}=req.body;
    //The database has the method to check whether the user exists. If there is a user it returns the user object. 
     const token=await User.matchPassword(email,password);
     if(!token)
        return res.render("signup");
    //  console.log('User',user);
    res.cookie("token",token)
    // console.log(token)
    res.redirect('/');
 }

 const signUp=(req,res)=>{
    res.render("signup")
}

const signIn=(req,res)=>{
    res.render("signin")
}

const logout=(req,res)=>{
    res.clearCookie("token");
    return res.redirect("/");
}

 module.exports={addUser,isUser,signUp,signIn,logout,handleValidation,handleOtp}