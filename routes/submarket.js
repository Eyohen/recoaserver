const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const SubMarket =require('../models/SubMarket')
// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')
const {
    CreateSubmarket,
    UpdateSubmarket,
    DeleteSubmarket,
    GetSubmarketDetails,
    SearchSubmarket,
    GetUserSubmarket
} = require('../controllers/submarket')


//CREATE
router.post("/create",verifyToken,CreateSubmarket)

//UPDATE
router.put("/:id",verifyToken,UpdateSubmarket)

//DELETE
router.delete("/:id",verifyToken,DeleteSubmarket)

//GET Submarket DETAILS
router.get("/:id",GetSubmarketDetails)  

//GET Submarkets
router.get("/",SearchSubmarket)

//GET USER POSTS
router.get("/user/:userId",GetUserSubmarket)



module.exports =router