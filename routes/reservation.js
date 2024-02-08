const express = require('express');
const router = express.Router();
const {
    newReservation,
    getReservations,
    getreservation,
    updateReservation,
    deleteReservation
} = require('../controllers/reservation');
const verifyToken = require('../middlewares/verifyToken')


// Create a Reservation
router.post('/create', verifyToken, newReservation);

// Get All 
router.get('/', getReservations);

// Get a Reservation by ID
router.get('/:id', getreservation);

// Update a Reservation
router.put('/:id', verifyToken, updateReservation);

// Delete a Reservation
router.delete('/:id', verifyToken, deleteReservation);

module.exports = router;
