const express=require('express')
const router=express.Router()
const Tenant = require('../models/Tenant')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')


//REGISTER tenants
router.post("/register",async(req,res)=>{
    try{
        const {tenant,email,password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password,salt)
        const newTenant = new Tenant({tenant,email,password:hashedPassword})
        const savedTenant = await newTenant.save()
        res.status(200).json(savedTenant)

    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }

})


//LOGIN tenants
router.post("/login",async (req,res)=>{
    try{
        const tenant =await Tenant.findOne({email:req.body.email})
       
        if(!tenant){
            return res.status(404).json("Tenant not found!")
        }
        const match=await bcrypt.compare(req.body.password,tenant.password)
        
        if(!match){
            return res.status(401).json("Wrong credentials!")
        }
        
        const token = jwt.sign({_id:tenant._id,email:tenant.email},process.env.SECRET,{expiresIn:"14d"})
        const {password,...info} = tenant._doc
        res.status(200).json({...info,access_token: token})

    }
    catch(err){
        res.status(500).json(err)
    }
})



// //UPDATE tenants
// router.put("/:id",verifyToken,async (req,res)=>{
//     try{
//         if(req.body.password){
//             const salt = await bcrypt.genSalt(10)
//             req.body.password = await bcrypt.hashSync(req.body.password,salt)
//         }
//         console.log(req.body)
//         const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
//         res.status(200).json(updatedUser)

//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// })


//DELETE tenant
router.delete("/:id",async (req,res)=>{
    try{
        await Tenant.findByIdAndDelete(req.params.id)
        // await Apartment.deleteMany({userId:req.params.id})
        // await Comment.deleteMany({userId:req.params.id})
        res.status(200).json("Tenant has been deleted!")

    }
    catch(err){
        res.status(500).json(err)
    }
})

//GET tenantS
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const tenants = await Tenant.find(query.search?searchFilter:null)
        res.status(200).json(tenants)
    }
    catch(err){
        res.status(500).json(err)
    }
})


//GET Tenant
router.get("/:id",async (req,res)=>{
    try{
        const user= await Tenant.findById(req.params.id)
        const {password,...info}=user._doc
        res.status(200).json(info)
    }
    catch(err){
        res.status(500).json(err)
    }
})



module.exports=router