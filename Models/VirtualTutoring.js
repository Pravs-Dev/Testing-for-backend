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
    type: String,
    required: true,
  },

  videoConferenceUrl: {
    type: String,
    required: true,
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const virtualTutoring= mongoose.model('VirtualTutoring', virtualTutoringSchema);

export default virtualTutoring;
