import express from 'express';
import Availability from '../../Models/Availability.js'; 
import {
  getAvailability,
  changeAvailability,
  deleteAvailability,
  createAvailability
} from '../../Controllers/Avail_Controller/AvailabilityC.js';

const router = express.Router();

// Fetch all tutors with their availability
router.get('/', async (req, res) => {
  try {
    const tutors = await Availability.find();
    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tutors', error: error.message });
  }
});



//Get tutor availability
router.get('/:tutor', async (req, res) => {
  try{
      const tutor = req.params.tutor;
      const availability = await getAvailability(tutor);
      res.json(availability);
  }
  catch(error){
      res.status(500).json({message: 'Error fetching availability', error: error.message});
  }
  
});

//Add tutor availability
router.put('/:id', async (req, res) => {
  try{
      const id = req.params.id;
      const payload = req.body;
      const availability = await changeAvailability(id, payload);
      res.status(201).json(availability);
  }
  catch(error){
      res.status(500).json({message: 'Error adding availability', error: error.message});
  }
});

//Post tutor availability
router.post('/', async (req, res) => {
  try{
      const payload = req.body;
      const availability = await createAvailability(payload);
      res.json(availability);
  }
  catch(error){
      res.status(500).json({message: 'Error fetching availability', error: error.message});
  }
  
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deleteAvailability(id);
    if (result) {
      res.status(200).json({ message: 'Availability deleted successfully' }); 
    } else {
      res.status(404).json({ message: 'Availability not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Availability', error: error.message });
  }
});

export default router;