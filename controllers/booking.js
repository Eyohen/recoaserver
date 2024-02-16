const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Booking = require('../models/Booking')
const SubMarket =require('../models/SubMarket')
const Community =require('../models/Community')
const verifyToken = require('../middlewares/verifyToken')

//CREATE


//UPDATE
const UpdateBooking = async (req,res)=>{
    try{
       
        const updatedBooking =await Booking.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedBooking)

    }
    catch(err){
        throw new Error(err)
    }
}


//DELETE
const DeleteBooking = async (req,res)=>{
    try{
        await Booking.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Booking has been deleted!")

    }
    catch(err){
        throw new Error(err)
    }
}


//GET Estate DETAILS
const GetBooking = async (req,res)=>{
    try{
        const booking =await Booking.findById(req.params.id).populate('communities')
        res.status(200).json(booking)
       
    }
    catch(err){
        throw new Error(err)
    }
}

//GET Estates
const SearchBookings = async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const booking =await Booking.find(query.search?searchFilter:null).populate('communities')
        res.status(200).json(booking)
    }
    catch(err){
        throw new Error(err)
    }
}

//GET USER POSTS
const GetUserBooking = async (req,res)=>{
    try{
        const booking =await Booking.find({userId:req.params.userId})
        res.status(200).json(booking)
    }
    catch(err){
        throw new Error(err)
    }
}



module.exports={
    UpdateBooking,
    DeleteBooking,
    GetBooking,
    SearchBookings,
    GetUserBooking
}