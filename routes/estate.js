const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
// const Apartment=require('../models/Apartment')
const Estate =require('../models/Estate')
// const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
        const newEstate =new Estate(req.body)
        // console.log(req.body)
        const savedEstate = await newEstate.save()
        
        res.status(200).json(savedEstate)
    }
    catch(err){
        
        res.status(500).json(err)
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedEstate =await Estate.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedEstate)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Estate.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET Estate DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const estate =await Estate.findById(req.params.id).populate('apartments')
        res.status(200).json(estate)
       
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
        const estate =await Estate.find(query.search?searchFilter:null).populate('apartments')
        res.status(200).json(estate)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const estate =await Estate.find({userId:req.params.userId})
        res.status(200).json(estate)
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports=router