const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const Tenant = require('../models/Tenant')
// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')

const RegisterUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, tenantId } = req.body
        const tenant = await Tenant.findById(tenantId)

        if (!tenant) {
            return res.status(404).json("Tenant not found!")
        }
       const match = await bcrypt.compare(password, tenant.password)

        if (!match) {
            return res.status(401).json("Wrong credentials!")
        }
        const newUser = new User({
            firstName, lastName, email, password: tenant.password, phone,
            role: 'tenant'
        })
        const savedUser = await newUser.save()
        // Exclude password from the response
        const { password: removedPassword, ...userWithoutPassword } = savedUser._doc;
        res.status(200).json(userWithoutPassword);

    }
    catch (err) {
        //console.log(err)
        return res.status(500).json(err.message)    }

}
//UPDATE
const UpdateUser = async (req,res)=>{
    try{
        if(req.body.password){
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hashSync(req.body.password,salt)
        }
        //console.log(req.body)
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedUser)

    }
    catch(err){
        return res.status(500).json(err.message)    }
}


//DELETE
const DeleteUser = async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        await Apartment.deleteMany({userId:req.params.id})
        await Comment.deleteMany({userId:req.params.id})
        res.status(200).json("User has been deleted!")

    }
    catch(err){
        return res.status(500).json(err.message)    }
}

//GET USERS
const SearchUsers = async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const users = await User.find(query.search?searchFilter:null)
        res.status(200).json(users)
    }
    catch(err){
        return res.status(500).json(err.message)    }
}


//GET USER
const GetUser = async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        const {password,...info}=user._doc
        res.status(200).json(info)
    }
    catch(err){
        return res.status(500).json(err.message)    }
}


module.exports={
    RegisterUser,
    UpdateUser,
    DeleteUser,
    SearchUsers,
    GetUser
}