import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    availability:[{
        date: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        slots: [{
            start: {
                type: String, // Time in HH:mm format
            },
            end: {
                type: String, // Time in HH:mm format
            }
        }]
    }]
});



const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;