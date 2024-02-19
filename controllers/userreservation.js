const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const UserReservation = require('../models/UserReservation');
const User = require('../models/User');

// Create a Reservation
const unewReservation = async (req, res) => {
    try {
        const { reservationId, userId, count } = req.body;
        console.log(req.body);
        // Update numAvailable in Reservation model
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            res.status(404).json({ error: 'Reservation not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        // First, try to find an existing reservation for this user and reservationId
        let userreservation = await UserReservation.findOne({
            reservation: reservationId,
            user: userId
        });

        if (userreservation) {
            // If an existing reservation is found, increment the count and numAvailable
            userreservation.count += count;
            userreservation.numAvailable += count; // Adjust this logic if numAvailable is meant to behave differently
            await userreservation.save();
        } else {
            // If no existing reservation is found, create a new one
            userreservation = new UserReservation({
                reservation: reservationId,
                user: userId,
                count: count,
                numAvailable: count
            });
            await userreservation.save();
            reservation.userreservations.push(reservation._id); // Add reservation to the reservations array
        }

        reservation.numAvailable -= count; // Reduce available units by count
        await reservation.save();

        user.reservations.push(reservation._id); // Add reservation to the reservations array
        await user.save();

        res.status(201).json({ message: 'Reservation created successfully', userreservation });
    } catch (error) {
        throw new Error(error)
    }
};

// Get All reservation
const ugetReservations = async (req, res) => {
    const query = req.query;
    console.log('here are the reservations');
    try {
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }
        };
        const reservations = await UserReservation.find(query.search ? searchFilter : null)
            .populate('reservation')
            .populate('user');
        console.log(reservations);
        res.status(200).json(reservations);
    } catch (error) {
        throw new Error(error)
    }
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
        console.log(reservation);
        res.status(200).json(reservation);
    } catch (error) {
        throw new Error(error)
    }
};

// Update a Reservation
const uupdateReservation = async (req, res) => {
    try {
        const { count: newCount } = req.body;
        const reservationId = req.params.id;

        // Find current reservation
        const currentReservation = await UserReservation.findById(reservationId);
        if (!currentReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Calculate count difference
        const countDifference = newCount - currentReservation.count;

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
            throw new Error('Unit type not found');
        }

        // Adjust numAvailable based on count difference
        reservation.numAvailable += countDifference;

        await reservation.save();

        res.status(200).json(updatedReservation);
    } catch (error) {
        throw new Error(error)
    }
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
            throw new Error('Unit type not found');
        }

        console.log(reservation);
        reservation.numAvailable += reservation.count; // Increase numAvailable by reservation count
        await reservation.save();

        // Delete reservation
        await Reservation.deleteOne({ _id: reservationId });

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
};


module.exports = {
    unewReservation,
    ugetReservations,
    ugetreservation,
    uupdateReservation,
    udeleteReservation
}
