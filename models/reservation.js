const mongoose = require('mongoose')
const UnitType = require('./UnitType');

const ReservationSchema = new mongoose.Schema({

    unitType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UnitType'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant'
    },
    count: {
        type: Number,
        required: false
    },
    numAvailable: {
        type: Number,
        required: false,
    },

}, { timestamps: true })

// Middleware function to check if the unit is still available and the count being reserved is enough
const checkAvailability = async (reservation) => {
    try {
        // Find the unit type associated with the reservation
        const unitType = await UnitType.findById(reservation.unitType);
        if (!unitType) {
            throw new Error('Unit type not found');
        }

        // Check if there are available units
        if (unitType.numAvailable <= 0) {
            throw new Error('No available units for reservation');
        }

        // Check if the count being reserved is enough
        if (reservation.count > unitType.numAvailable) {
            throw new Error('Insufficient available units for reservation');
        }

    } catch (error) {
        throw error;
    }
};

// Pre-save hook to check availability before saving a reservation
ReservationSchema.pre('save', async function (next) {
    try {
        await checkAvailability(this);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Reservation", ReservationSchema)