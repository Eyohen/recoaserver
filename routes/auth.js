const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { 
    Register,
    Login,
    AdminLogin,
    Logout,
    Refetch,
    LogoutWithCookies
} = require('../controllers/auth')


router.post("/register",Register)
router.post("/admin-login",AdminLogin)
router.post("/login",Login)
router.get("/logout-cookies",LogoutWithCookies)
router.get("/refetch", Refetch)
router.get("/logout",Logout)
  
module.exports=router