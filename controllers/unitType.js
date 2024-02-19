const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const UnitType =require('../models/UnitType')

// community = UnitType

// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')


//CREATE
const CreateUnitType = async (req,res)=>{
    try{
            
        const community = await Community.findById(req.body.community)
     
        if (!community) {
          res.status(404).json({ message: "Community not found" });
          return null;
        }
        console.log(req.body)
        const newUnitType = new UnitType({...req.body, total: req.body.numAvailable})
    
        const savedUnitType = await newUnitType.save()
    
        community.unitTypes = community.unitTypes.concat(savedUnitType);
    
        await community.save();
    
        res.status(200).json(savedUnitType)
    }
    catch(err){
        
        throw new Error(err)
    }
     
}



//UPDATE
const UpdateUnitType = async (req,res)=>{
    try{
       
        const updatedType =await UnitType.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedType)

    }
    catch(err){
        console.log(err.message)
        throw new Error(err)
    }
}



//DELETE
const DeleteUnitType = async (req, res) => {
    try {
        const unitType = await UnitType.findById(req.params.id);
        if (!unitType) {
            return res.status(404).json({ message: "UnitType not found!" });
        }

        await Reservation.deleteMany({ _id: { $in: unitType.reservations } });

        await UnitType.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "UnitType and its associated reservations have been deleted!" });
    } catch (err) {
        console.log(err.message)
        throw new Error(err)
    }
};



//GET UnitType
const GetUnitType = async (req,res)=>{
    // console.log(req.params.id)
    try{
        const unitType = await UnitType.findById(req.params.id).populate('community').populate('reservations');
        
        res.status(200).json(unitType)

    
    }
    catch(err){
        throw new Error(err)
    }
}

//GET UnitTypes
const FindUnitType = async (req,res)=>{
    const query = req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const unitTypes = await UnitType.find(query.search ? searchFilter : null).populate('community').populate('reservations');
        res.status(200).json(unitTypes)
    }
    catch(err){
        throw new Error(err)
    }
}


module.exports={
    CreateUnitType,
    UpdateUnitType,
    DeleteUnitType,
    GetUnitType,
    FindUnitType
}



