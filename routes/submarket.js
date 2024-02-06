const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const SubMarket =require('../models/SubMarket')
// const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
        const newSubMarket =new SubMarket(req.body)
        // console.log(req.body)
        const savedSubMarket = await newSubMarket.save()
        
        res.status(200).json(savedSubMarket)
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({message:"Submarket not created"})
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedSubMarket =await SubMarket.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedSubMarket)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await SubMarket.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Submarket has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET SubMarket DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const subMarket =await SubMarket.findById(req.params.id).populate('communities')
        res.status(200).json(subMarket)
       
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET SubMarkets
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const subMarket =await SubMarket.find(query.search?searchFilter:null).populate('communities')
        res.status(200).json(subMarket)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const subMarket =await SubMarket.find({userId:req.params.userId})
        res.status(200).json(subMarket)
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports =router