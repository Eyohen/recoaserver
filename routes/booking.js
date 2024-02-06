const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Booking = require('../models/Booking')
const SubMarket =require('../models/SubMarket')
const Community =require('../models/Community')
const verifyToken = require('../verifyToken')

//CREATE


//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedBooking =await Booking.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedBooking)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Booking.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Booking has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET Estate DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const booking =await Booking.findById(req.params.id).populate('communities')
        res.status(200).json(booking)
       
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET Estates
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const booking =await Booking.find(query.search?searchFilter:null).populate('communities')
        res.status(200).json(booking)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const booking =await Booking.find({userId:req.params.userId})
        res.status(200).json(booking)
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports=router