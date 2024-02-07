const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')


// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')
const SubMarket = require('../models/SubMarket')

//CREATE
const CreateCommunity = async (req,res)=>{
    try{
            
        const submarket = await SubMarket.findById(req.body.submarket)
     

        if (!submarket) {
          res.status(404).json({ message: "Submarket not found" });
          return null;
        }

        const newCommunity =new Community(req.body)
    
        const savedCommunity = await newCommunity.save()
    
        // const Communitys = await Community.create(CommunityDataArray);
    
    
        submarket.communities = submarket.communities.concat(savedCommunity);
    
        await submarket.save();
    
        res.status(200).json(savedCommunity)
    }
    catch(err){
        
        res.status(500).json({message:"Community not created"})
    }
     
}



//UPDATE
const UpdateCommunity = async (req,res)=>{
    try{
       
        const updatedCommunity =await Community.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedCommunity)

    }
    catch(err){
        console.log(err.message)
        res.status(500).json(err)
    }
}



//DELETE
const DeleteCommunity = async (req,res)=>{
    try{
        await Community.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Community has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
}


//GET Community
const GetCommunity = async (req,res)=>{
    // console.log(req.params.id)
    try{
        const foundCommunity =await Community.findById(req.params.id).populate('submarket').populate('unitTypes')
        console.log(foundCommunity)
        // console.log(Community)
        if(!Community){
            res.status(404).json("Community not found!")
        }
        
        res.status(200).json(foundCommunity)

    
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//GET Communitys
const SearchCommunity =  async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const Communitys = await Community.find(query.search?searchFilter:null).populate('submarket').populate('unitTypes')
        res.status(200).json(Communitys)
    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

//GET USER POSTS
const GetUserCommunity = async (req,res)=>{
    try{
        const Communitys =await Community.find({userId:req.params.userId})
        res.status(200).json(Communitys)
    }
    catch(err){
        res.status(500).json(err)
    }
}



module.exports={
    CreateCommunity,
    UpdateCommunity,
    DeleteCommunity,
    GetCommunity,
    SearchCommunity,
    GetUserCommunity
}



