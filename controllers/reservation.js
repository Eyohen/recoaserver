const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const UnitType = require('../models/UnitType');
const Tenant = require('../models/Tenant');

// Create a Reservation
const newReservation = async (req, res) => {
    try {
        const { unitTypeId, tenantId, count } = req.body;

        const Icount = parseInt(count);
        // Update numAvailable in UnitType model
        const unitType = await UnitType.findById(unitTypeId);
        if (!unitType) {
            return res.status(400).json('Unit type not found');
        }

        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(400).json('Tenant not found');
        }

        let existingReservation = await Reservation.findOne({ unitType: unitTypeId, tenant: tenantId });
        console.log(existingReservation);
        if (existingReservation) {
            const reservationId = existingReservation._id;
            console.log('reservationId', reservationId);
            const newcount = existingReservation.count + Icount;
            const newNumberAvailable = existingReservation.numAvailable + Icount;
            await Reservation.findByIdAndUpdate(
                reservationId,
                { 
                    count: newcount,
                    numAvailable: newNumberAvailable
                },
                { new: true }
            );
        } else {
            // Create reservation
            const newexistingReservation = new Reservation({
                unitType: unitTypeId,
                tenant: tenantId,
                count: Icount,
                numAvailable: Icount
            });
            const saved = await newexistingReservation.save();
            unitType.reservations.push(saved._id);
            existingReservation = saved;
            tenant.reservations.push(existingReservation._id); 
            await tenant.save();
        }

        unitType.numAvailable -= Icount; // Reduce available units by count 
        await unitType.save();
        
        res.status(201).json({ message: 'Reservation created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error.message)    }
};

// Get All reservation
const getReservations = async (req, res) => {
    const query = req.query;
    //console.log('here are the reservations');
    try {
        const searchFilter = {
            title: { $regex: query.search, $options: "i" }
        };
        const reservations = await Reservation.find(query.search ? searchFilter : null)
            .populate('unitType')
            .populate('tenant');
        //console.log(reservations);
        res.status(200).json(reservations);
    } catch (error) {
        return res.status(500).json(error.message)    }
};


// Get a Reservation by ID
const getreservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('unitType')
            .populate('tenant');

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' })
        }
        //console.log(reservation);
        res.status(200).json(reservation);
    } catch (error) {
        return res.status(500).json(error.message)    }
};

// Update a Reservation
const updateReservation = async (req, res) => {
    try {
        const { count: newCount } = req.body;
        const reservationId = req.params.id;

        const Icount = parseInt(newCount);
        // Find current reservation
        const currentReservation = await Reservation.findById(reservationId);
        if (!currentReservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Calculate count difference
        const countDifference = Icount - currentReservation.count;

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
            return res.status(400).json('Unit type not found');
        }

        // Adjust numAvailable based on count difference
        unitType.numAvailable -= countDifference;

        await unitType.save();

        res.status(200).json(updatedReservation);
    } catch (error) {
        return res.status(500).json(error.message)    }
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
            return res.status(400).json('Unit type not found');
        }

        //console.log(unitType);
        unitType.numAvailable += reservation.count; // Increase numAvailable by reservation count
        await unitType.save();

        // Delete reservation
        await Reservation.deleteOne({ _id: reservationId });

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error.message)    }
};


module.exports = {
    newReservation,
    getReservations,
    getreservation,
    updateReservation,
    deleteReservation
}
