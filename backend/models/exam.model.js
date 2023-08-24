const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExamSchema = new Schema({
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
    exam_start: {
        type: Date
    },
    exam_end: {
        type: Date
    },
    exam_type: {
        type: String,
        enum: ['pdf', 'google_form'],
    },
    attachment: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    },
    test_or_exam: {
        type: String,
        enum: ['test', 'exam'],
        default: 'active'
    }
}, { timestamps: true })

ExamSchema.index({standard: 1, division: 1})
module.exports = mongoose.model('exams', ExamSchema)
