const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Booking = require('../models/Booking')
const SubMarket =require('../models/SubMarket')
const Community =require('../models/Community')
const verifyToken = require('../middlewares/verifyToken')
const {
    CreateBooking,
    UpdateBooking,
    DeleteBooking,
    GetBooking,
    SearchBookings,
    GetUserBooking
} = require('../controllers/booking')


//CREATE


//UPDATE
router.put("/:id",verifyToken,UpdateBooking)


//DELETE
router.delete("/:id",verifyToken,DeleteBooking)


//GET Estate DETAILS
router.get("/:id",GetBooking)

//GET Estates
router.get("/",SearchBookings)

//GET USER POSTS
router.get("/user/:userId",GetUserBooking)

module.exports=router