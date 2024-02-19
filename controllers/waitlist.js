const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Waitlist = require('../models/Waitlist')
const Tenant =require('../models/Tenant')
const Community =require('../models/Community')
const verifyToken = require('../middlewares/verifyToken')

//CREATE
const CreateWaitlist = async (req, res) => {
    const { email, firstName, lastName, newtenant, tenantId, communityId } = req.body;

    if (tenantId && newtenant) {
        return res.status(400).json({ message: 'Please specify either tenantId or newtenant, not both.' });
    }
    try {
        let user = await User.findOne({ email });
        const userPassword = tenantId ? (await Tenant.findById(tenantId)).password : null;
        console.log(userPassword)
        // If user does not exist, create the user
        if (!user) {
            let userFields = {
                email,
                firstName,
                lastName,
                ...( userPassword ? {password : userPassword} : {}), 
                ...(tenantId ? { tenant: tenantId } : {}),
            };
            console.log(userFields)
            user = new User(userFields);
            await user.save();

            if (tenantId) {
                await Tenant.findByIdAndUpdate (tenantId, { $push: { users: user._id } });
            }
        }

        const community = await Community.findById(communityId);
        if (!community) return res.status(404).json({ message: 'Community not found' });

        // Creating a new waitlist entry
        const newWaitlistEntry = new Waitlist({
            user: user._id,
            community: community._id,
            ...(newtenant ? { newTenant: newtenant } : {}), // Conditionally add newTenant if provided
        });

        const savedEntry = await newWaitlistEntry.save();

        // Update user and community with the waitlist entry
        await User.findByIdAndUpdate(user._id, { $push: { waitlists: savedEntry._id } });
        await Community.findByIdAndUpdate(communityId, { $push: { waitlists: savedEntry._id } });

        res.status(201).json(savedEntry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



//UPDATE
const UpdateWaitlist = async (req,res)=>{
    try{
       
        const updatedWaitlist =await Waitlist.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedWaitlist)

    }
    catch(err){
        throw new Error(err)
    }
}


//DELETE
const DeleteWaitlist = async (req,res)=>{
    try{
        await Waitlist.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Waitlist has been deleted!")

    }
    catch(err){
        throw new Error(err)
    }
}


//GET Estate DETAILS
const GetWaitlist = async (req,res)=>{
    try{
        const booking =await Waitlist.findById(req.params.id).populate('communities')
        res.status(200).json(booking)
       
    }
    catch(err){
        throw new Error(err)
    }
}

//GET Estates
const SearchWaitlists = async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const booking =await Waitlist.find(query.search?searchFilter:null).populate('communities')
        res.status(200).json(booking)
    }
    catch(err){
        throw new Error(err)
    }
}

//GET USER POSTS
const GetUserWaitlist = async (req,res)=>{
    try{
        const booking =await Waitlist.find({userId:req.params.userId})
        res.status(200).json(booking)
    }
    catch(err){
        throw new Error(err)
    }
}

const GetWaitlistStats = async (req, res) => {
    try {
        const totalWithTenant = await Waitlist.find({ 'user.tenant': { $exists: true } }).countDocuments();
        const totalWithoutTenant = await Waitlist.find({ 'user.tenant': { $exists: false } }).countDocuments();
        res.json({
            totalWithTenant,
            totalWithoutTenant
        });
    } catch (error) {
        throw new Error(err)
    }
}


module.exports={
    CreateWaitlist,
    GetWaitlistStats,
    UpdateWaitlist,
    DeleteWaitlist,
    GetWaitlist,
    SearchWaitlists,
    GetUserWaitlist
}