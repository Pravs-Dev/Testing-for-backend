import mongoose from'mongoose';

const FeedbackSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session',
        required: true
    },    
    rating:{
        type: Number,
        required: [true, "Please give a rating"]
    },
    comment: {
        type: String,
        required: [true, "Please enter your feedback"],
        maxlength: 1000 
    },    
    subject: {
        type: String,
        required: [true, "Please specify the subject"],
      },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tutor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true});

const Feedback = mongoose.model('Feedback', FeedbackSchema);
export default Feedback;