const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    first_name: {
        type: String,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    user_type: {
        type: String,
        enum: ['admin', 'principal', 'vice_principal', 'management', 'teacher', 'student']
    },
    forgot_password_token: {
        type: String
    },
    status: {
        type: String,
        trim: true,
        enum: ['active', 'blocked', 'archive'],
        default: 'active'
    },
    contact_no : {
        type: String
    },
    birth_date: {
        type: Date
    },
    gender : {
        type: String,
        enum: ['male', 'female']
    },
    standard: {
        type: String
    },
    division: {
        type: String
    },
    admission_number: {
        type: String,
        index: true
    },
    guardian1_contact: {
        type: String
    },
    guardian2_contact: {
        type: String
    },
    profile_image: {
        type: String
    },
    subjects: [{
        uuid: {
            type: String
        },
        subject: {
            type: String
        },
        standard: {
            type: String
        },
        division: {
            type: String
        }
    }],
    is_class_teacher: {
        status: {
            type: Boolean,
            default: false
        },
        class: {
            standard: {
                type: String
            },
            division: {
                type: String
            }
        }
    },
    roll_number: {
        type: String
    },
    sts_number: {
        type: String
    }
}, { timestamp: true })

module.exports = mongoose.model('user', UserSchema)
