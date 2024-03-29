const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const SubMarket =require('../models/SubMarket')
// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')

//CREATE
const CreateSubmarket = async (req,res)=>{
    try{
        const newSubMarket =new SubMarket(req.body)
        // //console.log(req.body)
        const savedSubMarket = await newSubMarket.save()
        
        res.status(200).json(savedSubMarket)
    }
    catch(err){
        //console.log(err.message)
        return res.status(400).json({message:"Submarket not created"})
    }
     
}

//UPDATE
const UpdateSubmarket = async (req,res)=>{
    try{
       
        const updatedSubMarket =await SubMarket.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedSubMarket)

    }
    catch(err){
        return res.status(500).json(err.message)    }
}


//DELETE
const DeleteSubmarket = async (req,res)=>{
    try{
        await SubMarket.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Submarket has been deleted!")

    }
    catch(err){
        return res.status(500).json(err.message)    }
}


//GET SubMarket DETAILS
const GetSubmarketDetails = async (req,res)=>{
    try{
        const subMarket =await SubMarket.findById(req.params.id).populate('communities')
        res.status(200).json(subMarket)
       
    }
    catch(err){
        return res.status(500).json(err.message)    }
}

//GET SubMarkets
const SearchSubmarket = async (req,res)=>{
    const query=req.query
    //console.log("endpointhit")
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const subMarket =await SubMarket.find(query.search?searchFilter:null).populate('communities')
        res.status(200).json(subMarket)
    }
    catch(err){
        return res.status(500).json(err.message)    }
}

//GET USER POSTS
const GetUserSubmarket = async (req,res)=>{
    try{
        const subMarket =await SubMarket.find({userId:req.params.userId})
        res.status(200).json(subMarket)
    }
    catch(err){
        return res.status(500).json(err.message)    }
}


module.exports = {
    CreateSubmarket,
    UpdateSubmarket,
    DeleteSubmarket,
    GetSubmarketDetails,
    SearchSubmarket,
    GetUserSubmarket
}