const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const verifyToken = require('../middlewares/verifyToken')
const { 
    Register,
    Login,
    AdminLogin,
    Logout,
    Refetch,
    fetchStats,
    LogoutWithCookies
} = require('../controllers/auth')


router.post("/register",Register)
router.post("/admin-login",AdminLogin)
router.post("/login",Login)
router.get("/logout-cookies",LogoutWithCookies)
router.get("/refetch", Refetch)
router.get("/logout",Logout)
router.get("/admin/fetch-stats",verifyToken,fetchStats) 
  
module.exports=router