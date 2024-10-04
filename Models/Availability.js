const availabilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    slots: [{
        start: {
            type: String, // Time in HH:mm format
            required: true
        },
        end: {
            type: String, // Time in HH:mm format
            required: true
        }
    }]
});



const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;