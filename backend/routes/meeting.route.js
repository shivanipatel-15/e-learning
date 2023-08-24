const express = require('express')
const router = express.Router()
const meetingController = require('../controllers/meeting.controller')

router.post('/create_meeting', meetingController.createMeeting)
router.post('/join_meeting', meetingController.joinMeeting)
router.post('/list', meetingController.listMeeting)
router.post('/leave', meetingController.leaveMeeting)

module.exports = router