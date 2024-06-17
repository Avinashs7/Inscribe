const {Router}=require('express');
const {handleGoogleLogin,handleDataFromGoogle}=require('../controllers/googleAuth')
const router=Router()

router.get('/login',handleGoogleLogin)

router.get('/user',handleDataFromGoogle)

module.exports=router