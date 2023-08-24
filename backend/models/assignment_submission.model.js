const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AssignmentSubmissionSchema = new Schema({
    description: {
        type: String,
        trim: true
    },
    assignment_id: {
        type: Schema.Types.ObjectId,
        ref: 'assignment'
    },
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    attachment: {
        type: String
    },
    attachment_type: {
        type: String,
        enum: ['pdf', 'google_form'],
    },
    status: {
        type: String,
        enum: ['pending', 'complete', 'redo'],
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('assignment_submission', AssignmentSubmissionSchema)
