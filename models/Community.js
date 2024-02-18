const mongoose = require('mongoose')
const UnitType = require('./UnitType')

const CommunitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    floorsAvailable: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    openingDate: {
        type: String,
        required: false,
    },
    bedroom: {
        type: Number,
        required: false,
    },
    photo: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    size: {
        type: Number,
        required: false,
    },
    bathroom: {
        type: Number,
        required: false,
    },
    desc: {
        type: String,

    },
    userId: {
        type: String,
        required: false,
    },
    submarket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubMarket',
        required: true
    },
    unitTypes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnitType'
    }],
    waitlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Waitlist'
    }],

}, { timestamps: true })

// sort by newest
CommunitySchema.pre('find', function () {
    this.sort({ updatedAt: -1 });
})

module.exports = mongoose.model("Community", CommunitySchema)