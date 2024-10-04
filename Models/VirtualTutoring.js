import mongoose from 'mongoose';


const virtualTutoringSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledTime: {
    type: String,
    required: true,
  },

  scheduledDate: {
    type: Date,
    required: true,
  },

  videoConferenceUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'canceled'],
    default: 'scheduled'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const virtualTutoring= mongoose.model('VirtualTutoring', virtualTutoringSchema);

export default virtualTutoring;
