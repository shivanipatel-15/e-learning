const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

// user routes for app
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.post('/change-password', authController.changePassword)
router.post('/profile', authController.profile)
router.post('/edit-profile', authController.editProfile)
router.post('/forgot-password-request', authController.forgotPasswordRequest)


module.exports = router