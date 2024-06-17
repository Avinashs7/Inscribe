const { validateToken } = require("../services/authentication");

function checkForAuthentication(cookieName){
    return (req,res,next)=>{
        const tokenValue=req.cookies[cookieName];
        if(!tokenValue){
            return next();
        }
        try{
            const payload=validateToken(tokenValue);
            req.user=payload;
        }
        catch(err){
            console.log(err)
        }
        next();
    }
}

const userDetails=(req,res,next)=>{
    const tokenValue=req.cookies["token"];
        if(!tokenValue){
            return res.redirect("/user/signin");
        }
        try{
            const payload=validateToken(tokenValue);
            req.user=payload;
            return next();
        }
        catch(err){
            console.log("error in middleware")
            console.log(err)
        }
}

module.exports={checkForAuthentication,userDetails}