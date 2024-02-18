const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const UnitType = require('../models/UnitType');
const Tenant = require('../models/Tenant');

// Create a Reservation
const newReservation = async (req, res) => {
    try {
        const { unitTypeId, tenantId, count } = req.body;

        // Create reservation
        const reservation = new Reservation({
            unitType: unitTypeId,
            tenant: tenantId,
            count: count,
            numAvailable: count
        });
        await reservation.save();

        // Update numAvailable in UnitType model
        const unitType = await UnitType.findById(unitTypeId);
        if (!unitType) {
            throw new Error('Unit type not found');
        }

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            throw new Error('Tenant not found');
        }
        unitType.numAvailable -= count; // Reduce available units by count
        unitType.reservations.push(reservation._id); // Add reservation to the reservations array
        await unitType.save();

        tenant.reservations.push(reservation._id); // Add reservation to the reservations array
        await tenant.save();

        res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error) {
        throw new Error(error)
    }
};

// Get All reservation
const getReservations = async (req, res) => {
    const query = req.query;
    console.log('here are the reservations');
    try {
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }
        };
        const reservations = await Reservation.find(query.search ? searchFilter : null)
            .populate('unitType')
            .populate('tenant');
        console.log(reservations);
        res.status(200).json(reservations);
    } catch (error) {
        throw new Error(error)
    }
};


// Get a Reservation by ID
const getreservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' })
                .populate('unitType')
                .populate('tenant');
        }
        console.log(reservation);
        res.status(200).json(reservation);
    } catch (error) {
        throw new Error(error)
    }
};

// Update a Reservation
const updateReservation = async (req, res) => {
    try {
        const { count: newCount } = req.body;
        const reservationId = req.params.id;

        // Find current reservation
        const currentReservation = await Reservation.findById(reservationId);
        if (!currentReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Calculate count difference
        const countDifference = newCount - currentReservation.count;

        // Update reservation
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            req.body,
            { new: true }
        );
        if (!updatedReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update numAvailable in UnitType model
        const unitType = await UnitType.findById(updatedReservation.unitType);
        if (!unitType) {
            throw new Error('Unit type not found');
        }

        // Adjust numAvailable based on count difference
        unitType.numAvailable += countDifference;

        await unitType.save();

        res.status(200).json(updatedReservation);
    } catch (error) {
        throw new Error(error)
    }
};

const deleteReservation = async (req, res) => {
    try {
        const reservationId = req.params.id;

        // Find reservation
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Update numAvailable in UnitType model
        const unitType = await UnitType.findById(reservation.unitType);
        if (!unitType) {
            throw new Error('Unit type not found');
        }

        console.log(unitType);
        unitType.numAvailable += reservation.count; // Increase numAvailable by reservation count
        await unitType.save();

        // Delete reservation
        await Reservation.deleteOne({ _id: reservationId });

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        throw new Error(error)
    }
};


module.exports = {
    newReservation,
    getReservations,
    getreservation,
    updateReservation,
    deleteReservation
}
