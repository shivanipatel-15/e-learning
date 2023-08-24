const express = require('express')
const router = express.Router()
const registerController = require('../controllers/registration.controller')

router.post('/', registerController.registerUser)

module.exports = router