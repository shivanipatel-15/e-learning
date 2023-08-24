const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LiveClassSchema = new Schema({
    teacher_id: {
        type: String
    },
    class_name: {
        type: String
    },
    subject: {
        type: String
    },
    division: {
        type: String
    },
    standard: {
        type: String
    },
    status: {
        type: String,
        enum: ['live', 'expired'],
        default: 'live'
    }
}, { timestamps: true })

module.exports = mongoose.model('live_class', LiveClassSchema)
