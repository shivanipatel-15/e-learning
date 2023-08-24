const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AssignmentSchema = new Schema({
    subject: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    standard: {
        type: String,
        index: true
    },
    division: {
        type: String
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    submission_due: {
        type: Date
    },
    attachment: {
        type: String
    },
    assignment_type: {
        type: String,
        enum: ['pdf', 'google_form'],
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    }
}, { timestamps: true })

AssignmentSchema.index({standard: 1, division: 1})
module.exports = mongoose.model('assignments', AssignmentSchema)
