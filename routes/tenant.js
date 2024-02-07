const express=require('express')
const router=express.Router()
const Tenant = require('../models/Tenant')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {
    RegisterTenant,
    LoginTenant,
    DeleteTenant,
    GetTenant,
    FindTenant
} = require('../controllers/tenant')



//REGISTER tenants
router.post("/register",RegisterTenant)


//LOGIN tenants
router.post("/login",LoginTenant)


//DELETE tenant
router.delete("/:id",DeleteTenant)

//GET tenantS
router.get("/",FindTenant)


//GET Tenant
router.get("/:id",GetTenant)



module.exports=router