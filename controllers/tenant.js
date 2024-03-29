const express = require('express')
const router = express.Router()
const Tenant = require('../models/Tenant')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


//REGISTER tenants
const RegisterTenant = async (req, res) => {
    try {
        const { tenant, email, photo,phone,company, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password, salt)
        const newTenant = new Tenant({ 
            tenant, 
            email, 
            password: hashedPassword,
            photo,
            phone,
            company
        })
        const savedTenant = await newTenant.save()
        // exclude password field
        const { password: removedPassword, ...info } = savedTenant._doc
        res.status(200).json(info)

    }
    catch (err) {
        //console.log(err)
        return res.status(500).json(err.message)    }

}


//LOGIN tenants
const LoginTenant = async (req, res) => {
    try {
        const tenant = await User.findOne({ email: req.body.email })

        if (!tenant) {
            return res.status(404).json("Tenant not found!")
        }
        const match = await bcrypt.compare(req.body.password, tenant.password)

        if (!match) {
            return res.status(401).json("Wrong credentials!")
        }

        const token = jwt.sign({ _id: tenant._id, email: tenant.email }, process.env.SECRET, { expiresIn: "14d" })
        const { password, ...info } = tenant._doc
        if (tenant.tenant) {
            const tenantInfo = await Tenant.findById(tenant.tenant)
            info.tenantInfo = tenantInfo
        }
        res.status(200).json({ ...info, access_token: token })

    }
    catch (err) {
        return res.status(500).json(err.message)    }
}



// //UPDATE tenants
// router.put("/:id",verifyToken,async (req,res)=>{
//     try{
//         if(req.body.password){
//             const salt = await bcrypt.genSalt(10)
//             req.body.password = await bcrypt.hashSync(req.body.password,salt)
//         }
//         //console.log(req.body)
//         const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
//         res.status(200).json(updatedUser)

//     }
//     catch(err){
//         return res.status(500).json(err.message)//     }
// })


//DELETE tenant
const DeleteTenant = async (req, res) => {
    try {
        await Tenant.findByIdAndDelete(req.params.id)
        // await Apartment.deleteMany({userId:req.params.id})
        // await Comment.deleteMany({userId:req.params.id})
        res.status(200).json("Tenant has been deleted!")

    }
    catch (err) {
        return res.status(500).json(err.message)    }
}

//GET tenantS
const FindTenant = async (req, res) => {
    const query = req.query;

    try {
        const searchFilter = {
            tenant: { $regex: query.search, $options: "i" } // Update the field to search
        };
        const tenants = await Tenant.find(query.search ? searchFilter : null)
            .select('-password')
            .populate('reservations')
            .exec();
        res.status(200).json(tenants);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

// GET Tenant
const GetTenant = async (req, res) => {
    try {
        const user = await Tenant.findById(req.params.id).select('-password'); // Exclude password field
        res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};



module.exports = {
    RegisterTenant,
    LoginTenant,
    DeleteTenant,
    FindTenant,
    GetTenant
}