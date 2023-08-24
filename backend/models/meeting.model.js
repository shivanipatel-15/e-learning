const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MeetingSchema = new Schema({
    created_by: {
        type: String
    },
    user_ids: {
        type: Array
    },
    subject: {
        type: String
    },
    total_participant_joined: {
        type: Array
    },
    meeting_id: {
        type: String
    },
    start_date_time: {
        type: Date
    },
    end_date_time: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'live', 'completed'],
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('meeting', MeetingSchema)
