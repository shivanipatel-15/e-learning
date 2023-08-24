const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TimeTableSchema = new Schema({
    subject: {
        type: String,
        trim: true
    },
    division: {
        type: String,
        trim: true
    },
    standard: {
        type: String,
        trim: true
    },
    teacher_id: {
        type: String,
        trim: true
    },
    teacher_username: {
        type: String,
        trim: true
    },
    day: {
        type: String,
        trim: true
    },
    start_time: {
        type: String,
        trim: true
    },
    end_time: {
        type: String,
        trim: true
    }
}, { timestamps: true })

module.exports = mongoose.model('time_table', TimeTableSchema)
