const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')
const {
    RegisterUser,
    UpdateUser,
    DeleteUser,
    GetUser,
    SearchUsers,
} = require('../controllers/users')


//Register
router.post("/new",RegisterUser)

//UPDATE
router.put("/:id",verifyToken,UpdateUser)

//DELETE
router.delete("/:id",verifyToken,DeleteUser)

//GET USERS
router.get("/",SearchUsers)


//GET USER
router.get("/:id",GetUser)


module.exports=router