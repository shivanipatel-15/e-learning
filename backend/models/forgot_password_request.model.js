const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ForgotPasswordRequestSchema = new Schema({
    user_type: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    contact_no: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    },
    user_id: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('forgot_password_request', ForgotPasswordRequestSchema)
