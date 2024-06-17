require('dotenv').config()
const {getGoogleAuthUrl,getGoogleTokens,getGoogleUser}=require('../services/oAuth')
const {addUser,isUser}=require('./user')
const User=require('../models/users')

const handleGoogleLogin=(req,res)=>{
    res.redirect(getGoogleAuthUrl());
}

const handleDataFromGoogle=async(req,res)=>{
    try {
        const { code } = req.query;
        const tokens = await getGoogleTokens(code);
        const googleUser = await getGoogleUser(tokens.id_token, tokens.access_token);
        if(googleUser.email_verified){
            const user=await User.findOne({email:googleUser.email});
            // console.log(user);
            if(user){
                req.body.email=googleUser.email;
                req.body.password=googleUser.sub+googleUser.family_name;
                isUser(req,res);
            }
            else{
                req.body.email=googleUser.email;
                req.body.password=googleUser.sub+googleUser.family_name;
                req.body.fullName=googleUser.given_name+" "+googleUser.family_name;
                req.body.profile=googleUser.picture;
                addUser(req,res);
            }
        }
    }
    catch(err){
        console.error("Error in signing in with google"+err);
    }
}



module.exports={handleGoogleLogin,handleDataFromGoogle}