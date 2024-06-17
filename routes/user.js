const {Router}=require("express");
const User=require("../models/users");
const { addUser,isUser,signUp,signIn,logout,handleValidation,handleOtp } = require("../controllers/user");
const { userDetails } = require("../middlewares/authentication");
const router=Router();

router.get("/signin",signIn)

router.get("/signup",signUp)

router.get("/verify",handleOtp)

router.post('/verify',userDetails,handleValidation)

router.post("/signin",isUser)

router.post("/signup",addUser)

router.get('/logout',logout)

 module.exports=router