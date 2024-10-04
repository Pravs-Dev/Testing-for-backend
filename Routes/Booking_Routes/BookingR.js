import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  modifyBooking,
  cancelBooking,
  deleteBookingById, 
} from '../../Controllers/Booking_Controller/BookingC.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const bookings = await getAllBookings();
    res.status(200).json(bookings); 
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await getBookingById(id);
    if (booking) {
      res.status(200).json(booking); 
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
});


router.post('/', async (req, res) => {
  const newBooking = req.body;
  try {
    const booking = await createBooking(newBooking);
    res.status(201).json(booking); 
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const booking = await modifyBooking(id, payload);
    if (booking) {
      res.status(200).json(booking); 
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
});


router.put('/cancel/:id', async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body; 
  try {
    const booking = await cancelBooking(id, reason);
    if (booking) {
      res.status(200).json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error: error.message });
  }
});



router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteBookingById(id); 
    if (result) {
      res.status(200).json({ message: 'Booking deleted successfully' }); 
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

export default router;
