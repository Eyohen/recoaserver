const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const UserReservation = require('../models/UserReservation');
const User = require('../models/User');

// Create a Reservation
const unewReservation = async (req, res) => {
    try {
        const { reservationId, userId, count } = req.body;
        const Icount = parseInt(count);
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            res.status(404).json({ error: 'Reservation not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        let userreservation = await UserReservation.findOne({
            reservation: reservationId,
            user: userId
        });

        if (userreservation) {
            const reservationId = userreservation._id;
            console.log('reservationId', reservationId);
            const newcount = userreservation.count + Icount;
            const newNumberAvailable = userreservation.numAvailable + Icount;
            await UserReservation.findByIdAndUpdate(
                reservationId,
                {
                    count: newcount,
                    numAvailable: newNumberAvailable
                },
                { new: true }
            );
        } else {
            // If no existing reservation is found, create a new one
            const newuserreservation = new UserReservation({
                reservation: reservationId,
                user: userId,
                count: Icount,
                numAvailable: Icount
            });
            const saved = await newuserreservation.save();
            reservation.userreservations.push(saved._id); // Add reservation to the reservations 
            userreservation = saved;
            user.reservations.push(reservation._id); // Add reservation to the reservations array
            await user.save();
        }

        reservation.numAvailable -= Icount; // Reduce available units by count
        await reservation.save();


        res.status(201).json({ message: 'Reservation created successfully', userreservation });
    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message)    }
};

// Get All reservation
const ugetReservations = async (req, res) => {
    const query = req.query;
    //console.log('here are the reservations');
    try {
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }
        };
        const reservations = await UserReservation.find(query.search ? searchFilter : null)
            .populate({
                path: 'reservation',
                populate: { path: 'tenant unitType' }
            })            .populate('user');
        //console.log(reservations);
        res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json(error.message)    }
};


// Get a Reservation by ID
const ugetreservation = async (req, res) => {
    try {
        const reservation = await UserReservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' })
                .populate('reservation')
                .populate('user');
        }
        //console.log(reservation);
        res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json(error.message)    }
};

// Update a Reservation
const uupdateReservation = async (req, res) => {
    try {
        const { count: newCount } = req.body;
        const reservationId = req.params.id;

        const Icount = parseInt(newCount);
        // Find current reservation
        const currentReservation = await UserReservation.findById(reservationId);
        if (!currentReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Calculate count difference
        const countDifference = Icount - currentReservation.count;

        // Update reservation
        const updatedReservation = await UserReservation.findByIdAndUpdate(
            reservationId,
            req.body,
            { new: true }
        );
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update numAvailable in Reservation model
        const reservation = await Reservation.findById(updatedReservation.reservation);
        if (!reservation) {
            return res.status(400).json('Unit type not found');
        }

        // Adjust numAvailable based on count difference
        reservation.numAvailable += countDifference;

        await reservation.save();

        res.status(200).json(updatedReservation);
    } catch (error) {
        return res.status(500).json(error.message)    }
};

const udeleteReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;

        // Find reservation
        const userreservation = await UserReservation.findById(reservationId);
        if (!userreservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update numAvailable in Reservation model
        const reservation = await Reservation.findById(userreservation.reservation);
        if (!reservation) {
            return res.status(400).json('Unit type not found');
        }

        //console.log(reservation);
        reservation.numAvailable += reservation.count; // Increase numAvailable by reservation count
        await reservation.save();

        // Delete reservation
        await UserReservation.deleteOne({ _id: reservationId });

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error.message)    }
};


module.exports = {
    unewReservation,
    ugetReservations,
    ugetreservation,
    uupdateReservation,
    udeleteReservation
}
