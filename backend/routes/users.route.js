const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')

router.post('/list', usersController.userList)
router.post('/detail/:user_id', usersController.userDetail)
router.post('/forgot-password-request-list', usersController.forgotPasswordRequestList)
router.post('/forgot-password-request-complete', usersController.forgotPasswordRequestComplete)
router.post('/edit-profile/:user_id', usersController.userProfileEdit)
router.post('/get-all-teacher', usersController.getAllTeachers)
router.post('/assign-subject', usersController.addTeacherSubject)
router.post('/remove-subject', usersController.removeTeacherSubject)
router.post('/import/csv', usersController.importStudentCSV)
router.get('/get-count', usersController.countUsers)
router.post('/import-teacher/csv', usersController.importTeacherCSV)
router.post('/change-status', usersController.changeStatus)
router.post('/get-all-staff', usersController.getAllStaff)
router.post('/import-teacher/subject-csv', usersController.importTeacherSubjectCSV)

module.exports = router