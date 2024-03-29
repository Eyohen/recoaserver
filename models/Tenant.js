const mongoose = require('mongoose')

const TenantSchema = new mongoose.Schema({

    tenant: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    reservations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: false
    }],
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]

}, { timestamps: true })

TenantSchema.pre('find', function () {
    this.sort({ updatedAt: -1 });
})

module.exports = mongoose.model("Tenant", TenantSchema)

