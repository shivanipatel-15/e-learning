const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CircularSchema = new Schema({
    circular_type: {
        type: String,
        enum: ['circular', 'syllabus', 'calender', 'notes'],
    },
    circular_url: {
        type: String,
        trim: true
    },
    board: {
        type: String
    },
    standard: {
        type: String,
        index: true
    },
    division: {
        type: String
    },
    subject: {
        type: String
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    }
}, { timestamps: true })

CircularSchema.index({standard: 1, division: 1, circular_for: true })
module.exports = mongoose.model('circular', CircularSchema)
