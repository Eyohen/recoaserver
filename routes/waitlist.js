const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Waitlist = require('../models/Waitlist')
const SubMarket =require('../models/SubMarket')
const Community =require('../models/Community')
const verifyToken = require('../middlewares/verifyToken')
const {
    CreateWaitlist,
    UpdateWaitlist,
    DeleteWaitlist,
    GetWaitlist,
    SearchWaitlists,
    GetUserWaitlist,
    GetWaitlistStats
} = require('../controllers/waitlist')


//CREATE
router.post("/new",CreateWaitlist)

//UPDATE
router.put("/:id",verifyToken,UpdateWaitlist)

//DELETE
router.delete("/:id",verifyToken,DeleteWaitlist)


//GET Estate DETAILS
router.get("/:id",GetWaitlist)

//GET Estates
router.get("/",SearchWaitlists)

//GET USER POSTS
router.get("/user/:userId",GetUserWaitlist)

//GET STATS
router.get("/stats",GetWaitlistStats)

module.exports=router