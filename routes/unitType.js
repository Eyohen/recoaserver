const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Community =require('../models/Community')
const UnitType =require('../models/UnitType')
const {
    CreateUnitType,
    UpdateUnitType,
    DeleteUnitType,
    GetUnitType,
    FindUnitType,
} = require('../controllers/unitType')

// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')

//CREATE
router.post("/create",verifyToken,CreateUnitType)

//UPDATE
router.put("/:id",verifyToken,UpdateUnitType)

//DELETE
router.delete("/:id",verifyToken,DeleteUnitType)

//GET UnitType
router.get("/:id",GetUnitType)

//GET UnitTypes
router.get("/", FindUnitType)


module.exports=router



