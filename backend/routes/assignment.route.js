const express = require('express')
const router = express.Router()
const assignmentController = require('../controllers/assignment.controller')

router.post('/add', assignmentController.addAssignment)
router.post('/list', assignmentController.listAssignment)
router.post('/detail/:assignment_id', assignmentController.detailAssignment)
router.post('/submit', assignmentController.submit)
router.post('/submissions/:assignment_id', assignmentController.submissionsForAssignment)
router.post('/edit', assignmentController.editAssignment)
router.post('/remove', assignmentController.removeAssignment)
router.post('/completed/:assignment_id', assignmentController.completeAssignment)
router.post('/assignment-update', assignmentController.updateAssignmentStatus)
router.post('/assignment-submission/:assignment_id', assignmentController.studentAssignmentSubmission)

module.exports = router