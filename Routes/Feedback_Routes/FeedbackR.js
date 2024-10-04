import express from 'express';
import {
    createFeedback,
    getFeedbackBySession,
    updateFeedback,
    deleteFeedback,
    getTutorFeedback,
    getAllFeedback  
} from '../../Controllers/Feedback_Controller/FeedbackC.js';

// Initialize express
const router = express.Router();

// Post feedback
router.post('/submit', async (request, context) => {
    try {
        const feedback = request.body;
        const savedFeedback = await createFeedback(feedback);
        context.json({ message: 'Feedback submitted successfully', feedback: savedFeedback });
    } catch (error) {
        context.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
});

// Get a specific tutor's rating
router.get('/rating/:id', async (request, context) => {
    const id = request.params.id;
    try {
        // Get rating from database
        const rating = { "rating": 4 }; // Replace this with actual logic to fetch rating
        context.json(rating);
    } catch (error) {
        context.status(500).json({ message: 'Error fetching rating', error: error.message });
    }
});

// Get all feedbacks (NEW ROUTE)
router.get('/', async (request, context) => {
    try {
        const feedbacks = await getAllFeedback();  // Fetch all feedbacks
        context.json(feedbacks);
    } catch (error) {
        context.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
    }
});

// Get feedback by tutor id
router.get('/:tutorId', async (request, context) => {
    const tutorId = request.params.tutorId;
    try {
        const feedback  = await getTutorFeedback(tutorId);
        context.json(feedback);
    } catch (error) {
        context.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

// Get feedback of a session
router.get('/session/:session', async (request, context) => {
    const session = request.params.session;
    try {
        const feedback = await getFeedbackBySession(session);
        context.json(feedback);
    } catch (error) {
        context.status(500).json({ message: 'Error fetching feedback', error: error.message });
    }
});

// Update specific feedback
router.put('/:id', async (request, context) => {
    const id = request.params.id; // Corrected from sessionId to id
    const feedback = request.body;
    try {
        const updatedFeedback = await updateFeedback(id, feedback);
        context.json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
    } catch (error) {
        context.status(500).json({ message: 'Error updating feedback', error: error.message });
    }
});

// Delete specific feedback
router.delete('/:feedbackId', async (request, context) => {
    const feedbackId = request.params.feedbackId;
    try {
        await deleteFeedback(feedbackId);
        context.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        context.status(500).json({ message: 'Error deleting feedback', error: error.message });
    }
});

export default router;
