const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Apartment=require('../models/Apartment')
const Estate = require('../models/Estate')
// const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
            console.log(req.body.estate)
        const estate = await Estate.findById(req.body.estate)
        console.log(estate)

        if (!estate) {
          console.log(`Estate with name ${estateName} not found.`);
          return null;
        }

        const newApartment =new Apartment(req.body)
    
        const savedApartment = await newApartment.save()
    
        // const apartments = await Apartment.create(apartmentDataArray);
    
    
        estate.apartments = estate.apartments.concat(savedApartment);
    
        await estate.save();
    
        
        res.status(200).json(savedApartment)
    }
    catch(err){
        
        res.status(500).json(err)
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
       
        const updatedApartment =await Apartment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedApartment)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        await Apartment.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET aprtment
router.get("/:id",async (req,res)=>{
    console.log(req.params.id)
    try{
        const apartment =await Apartment.findById(req.params.id).populate('estate')
        console.log(apartment)
        if(!apartment){
            throw Error
        }
        
        res.status(200).json(apartment)

    
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET Apartments
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const apartments = await Apartment.find(query.search?searchFilter:null).populate('estate')
        res.status(200).json(apartments)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const apartments =await Apartment.find({userId:req.params.userId})
        res.status(200).json(apartments)
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports=router



