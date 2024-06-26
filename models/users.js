
const {createHmac,randomBytes}=require("crypto")
const mongoose=require('mongoose');
const { generateToken } = require("../services/authentication");

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        type:String,
        default:'../public/images/infi.jpg'
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User",
    },
    isValidated:{
        type:Boolean,
        default:false,
    },
    otp:{
        type:String,
    },
    otpExpires:{
        type:Date,
        default:new Date(Date.now()+5*60000),
    }
},{
    timestamps:true,
})

userSchema.pre("save",function(next){
    const user=this;
    if(!user.isModified("password"))return next();
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update("password").digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

userSchema.static('matchPassword', async function (email,password){
    const user=await this.findOne({email});
    if(!user)
        return null;
    const salt=user.salt;
    const hashedPassword=user.password;
    const userProvidedPassword=createHmac('sha256',salt).update("password").digest("hex");
    if(hashedPassword!==userProvidedPassword)
        return null;
    if(user.isValidated){
        const token=generateToken(user);
        return token;
    }
    else{
        return null;
    }
})

const User=mongoose.model('user',userSchema)
module.exports=User;