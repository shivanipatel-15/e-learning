const express = require('express')
const router = express.Router()
const timetableController = require('../controllers/timetable.controller')

router.post('/add', timetableController.addTimetable)
router.post('/get-standard-class', timetableController.getTodayClassByStandard)
router.post('/get-teacher-class', timetableController.getTodayClassByTeacher)
router.post('/get-all-class', timetableController.getAllTodayClass)
router.post('/get-timetable-list', timetableController.getTimeTableList)
router.post('/remove/:timetable_id', timetableController.removeTimetable)
router.post('/edit/:timetable_id', timetableController.editTimetable)
router.post('/detail/:timetable_id', timetableController.detailTimetable)

module.exports = router