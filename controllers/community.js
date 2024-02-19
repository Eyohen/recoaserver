const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Community = require('../models/Community')
// const Comment=require('../models/Comment')
const verifyToken = require('../middlewares/verifyToken')
const SubMarket = require('../models/SubMarket')
const Tenant = require('../models/Tenant')
const Reservation = require('../models/Reservation')

//CREATE
const CreateCommunity = async (req, res) => {
    try {

        console.log(req.body)
        const submarket = await SubMarket.findById(req.body.submarket)


        if (!submarket) {
            res.status(404).json({ message: "Submarket not found" });
            return null;
        }
        const newCommunity = new Community(req.body)

        const savedCommunity = await newCommunity.save()

        // const Communitys = await Community.create(CommunityDataArray);


        submarket.communities = submarket.communities.concat(savedCommunity);

        await submarket.save();

        res.status(200).json(savedCommunity)
    }
    catch (err) {

        throw new Error({ message: "Community not created" })
    }

}



//UPDATE
const UpdateCommunity = async (req, res) => {
    try {

        const updatedCommunity = await Community.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        res.status(200).json(updatedCommunity)

    }
    catch (err) {
        console.log(err.message)
        throw new Error(err)
    }
}



//DELETE
const DeleteCommunity = async (req, res) => {
    try {
        await Community.findByIdAndDelete(req.params.id)
        // await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Community has been deleted!")

    }
    catch (err) {
        throw new Error(err)
    }
}


//GET Community
const GetCommunity = async (req, res) => {
    // console.log(req.params.id)
    try {
        const foundCommunity = await Community.findById(req.params.id).populate('submarket').populate('unitTypes')
        console.log(foundCommunity)
        // console.log(Community)
        if (!Community) {
            res.status(404).json("Community not found!")
        }

        res.status(200).json(foundCommunity)


    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

//GET Communitys
const SearchCommunity = async (req, res) => {
    const { submarketId, search } = req.query;

    try {
        // Validate the submarketId if provided
        if (submarketId && !mongoose.Types.ObjectId.isValid(submarketId)) {
            return res.status(400).json({ message: 'Invalid Submarket ID' });
        }

        let searchFilter = {};

        // Add submarket filter if submarketId is provided
        if (submarketId) {
            searchFilter.submarket = submarketId;
        }

        // Add search term filter if search query is provided
        if (search) {
            searchFilter.$or = [
                { name: { $regex: search, $options: "i" } },
                // You can add more fields to search by here, e.g., description
                // { 'description': { $regex: search, $options: "i" } }
            ];
        }
        const Communitys = await Community.find(searchFilter).populate('submarket').populate('unitTypes')
        res.status(200).json(Communitys)
    }
    catch (err) {
        console.log(err)
        throw new Error(err)
    }
}

//GET USER POSTS
const GetUserCommunity = async (req, res) => {
    try {
        const Communitys = await Community.find({ userId: req.params.userId })
        res.status(200).json(Communitys)
    }
    catch (err) {
        throw new Error(err)
    }
}

const getTenantReservedCommunities = async (req, res) => {
    try {
        const tenantId = req.params.id;

        const reservations = await Reservation.find({ tenant: tenantId }).populate('unitType');

        const unitTypeIds = reservations.map(reservation => reservation.unitType._id);

        const uniqueUnitTypeIds = [...new Set(unitTypeIds)];

        const communities = await Community.find({
            'unitTypes': { $in: uniqueUnitTypeIds }
        }).populate('submarket');
        // Return the communities
        res.json(communities);
    } catch (error) {
        throw new Error(error)
    }
}


module.exports = {
    CreateCommunity,
    UpdateCommunity,
    DeleteCommunity,
    GetCommunity,
    SearchCommunity,
    GetUserCommunity,
    getTenantReservedCommunities
}



