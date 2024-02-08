const express = require('express');
const router = express.Router();
const { Reservation } = require('../models/Reservation');
const {
    newReservation,
    getReservations,
    getreservation,
    upateReservation,
    deleteReservation
} = require('../controllers/reservation');
const verifyToken = require('../middlewares/verifyToken')


// Create a Reservation
router.post('/reservation', verifyToken, newReservation);

// Get All reservation
router.get('/reservation', getReservations);

// Get a Reservation by ID
router.get('/reservation/:id', getreservation);

// Update a Reservation
router.put('/reservation/:id', verifyToken, upateReservation);
// Delete a Reservation
router.delete('/reservation/:id', verifyToken, deleteReservation);

module.exports = router;
