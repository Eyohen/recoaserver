const mongoose = require('mongoose')
const Reservation = require('./Reservation');

const UserReservationSchema = new mongoose.Schema({

    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    count: {
        type: Number,
        required: false
    }

}, { timestamps: true })

// Middleware function to check if the unit is still available and the count being reserved is enough
const checkAvailability = async (userreservation) => {
    try {
        // Find the unit type associated with the reservation
        const reservation = await Reservation.findById(userreservation.reservation);
        if (!reservation) {
            return new Error('Reservation not found');
        }

        // Check if there are available units
        if (reservation.numAvailable <= 0) {
            return new Error('No available units for reservation');
        }

        // Check if the count being reserved is enough
        if (userreservation.count > reservation.numAvailable) {
            return new Error('Insufficient available units for reservation');
        }

    } catch (error) {
        throw error;
    }
};

// Pre-save hook to check availability before saving a reservation
UserReservationSchema.pre('save', async function (next) {
    try {
        await checkAvailability(this);
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("UserReservation", UserReservationSchema)