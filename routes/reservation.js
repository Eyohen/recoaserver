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

const {
    unewReservation,
    ugetReservations,
    ugetreservation,
    uupdateReservation,
    udeleteReservation
} = require('../controllers/userreservation');


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

// Create a Reservation
router.post('/user/create', verifyToken, unewReservation);

// Get All 
router.get('/user/all', ugetReservations);

// Get a Reservation by ID
router.get('/user/:id', ugetreservation);

// Update a Reservation
router.put('/user/:id', verifyToken, uupdateReservation);

// Delete a Reservation
router.delete('/user/:id', verifyToken, udeleteReservation);

module.exports = router;
