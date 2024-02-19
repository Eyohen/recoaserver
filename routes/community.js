const express=require('express')
const router=express.Router()
const {
    CreateCommunity,
    UpdateCommunity,
    DeleteCommunity,
    GetCommunity,
    SearchCommunity,
    GetUserCommunity,
    getTenantReservedCommunities
} = require('../controllers/community')
// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')

//CREATE
router.post("/create",verifyToken,CreateCommunity)

//UPDATE
router.put("/:id",verifyToken,UpdateCommunity)

//DELETE
router.delete("/:id",verifyToken,DeleteCommunity)

//GET Community
router.get("/:id",GetCommunity)

//GET Communitys
router.get("/", SearchCommunity)

//GET USER POSTS
router.get("/user/:userId",GetUserCommunity)

//Get tenant reserved communities
router.get("/tenant/:id",getTenantReservedCommunities)



module.exports=router



