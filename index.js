const express=require('express')
const path=require('path')
const app=express()
const mongoose=require("mongoose")

require('dotenv').config()
const cookieParser=require('cookie-parser')
const { checkForAuthentication } = require('./middlewares/authentication')

const userRoute=require("./routes/user")
const oAuthRoute=require('./routes/googleAuth')

const PORT=process.env.PORT || 8000

app.set('view engine','ejs')
app.set("views",path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthentication("token"))
app.use(express.static(path.join(__dirname,'static')))
app.use(express.static(path.join(__dirname,'public')))

app.use('/user',userRoute)
app.use('/auth',oAuthRoute)

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(()=>{
    console.log("Database connected")
}).catch((err)=>console.log(err))


app.get("/",(req,res)=>{
    res.render("home",{user:req.user})
})

app.listen(PORT,()=>{
    console.log(`Server running in http://localhost:${PORT}`)
})

