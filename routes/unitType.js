const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const UnitType =require('../models/UnitType')

// community = UnitType

// const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')


//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
            
        const community = await Community.findById(req.body.community)
     
        if (!community) {
          console.log(`Community not found.`);
          return null;
        }

        const newUnitType = new UnitType(req.body)
    
        const savedUnitType = await newUnitType.save()
    
        
    
    
        community.unitTypes = community.unitTypes.concat(savedUnitType);
    
        await community.save();
    
        res.status(200).json(savedUnitType)
    }
    catch(err){
        
        res.status(500).json({message:"UnitType not created"})
    }
     
})



//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedType =await UnitType.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedType)

    }
    catch(err){
        console.log(err.message)
        res.status(500).json(err)
    }
})



//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await UnitType.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json({message:"Community has been deleted!"})

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET UnitType
router.get("/:id",async (req,res)=>{
    // console.log(req.params.id)
    try{
        const unitType = await UnitType.findById(req.params.id).populate('community')
        // console.log(Community)
        // if(!Community){
        //     throw Error
        // }
        
        res.status(200).json(unitType)

    
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET UnitTypes
router.get("/", async (req,res)=>{
    const query = req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const unitTypes = await UnitType.find(query.search?searchFilter:null).populate('community')
        res.status(200).json(unitTypes)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
// router.get("/user/:userId",async (req,res)=>{
//     try{
//         const Communitys =await Community.find({userId:req.params.userId})
//         res.status(200).json(Communitys)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// })



module.exports=router


