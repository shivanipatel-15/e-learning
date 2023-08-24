const express = require('express')
const router = express.Router()
const liveClassController = require('../controllers/liveClass.controller')

router.post('/create_class', liveClassController.create_class)
router.post('/join_class', liveClassController.join_class)
router.post('/leave_class', liveClassController.leave_class)
router.post('/list', liveClassController.listClass)

module.exports = router