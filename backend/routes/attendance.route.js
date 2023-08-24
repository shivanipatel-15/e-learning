const express = require('express')
const router = express.Router()
const attendanceController = require('../controllers/attendance.controller')

router.post('/get-students-list', attendanceController.getStudentList)
router.post('/save-attendance', attendanceController.saveAttendance)
router.post('/edit-attendance', attendanceController.editAttendance)
router.post('/save-student-login-time', attendanceController.saveStudentLoginTime)
router.post('/save-student-logout-time', attendanceController.saveStudentLogoutTime)

module.exports = router