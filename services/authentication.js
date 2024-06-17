const jwt=require('jsonwebtoken')

function generateToken(user){
    // console.log(user);
    const payload={
        _id:user._id,
        email:user.email,
        role:user.role,
        name:user.fullName
    }
    const token=jwt.sign(payload,process.env.SECRET);
    return token;
}

function validateToken(token){
    try{
        return jwt.verify(token,process.env.SECRET);  
    }
    catch(err){
        console.log(err)
    }
}

module.exports={generateToken,validateToken}