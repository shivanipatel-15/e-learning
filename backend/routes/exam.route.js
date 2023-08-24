const express = require('express')
const router = express.Router()
const examController = require('../controllers/exam.controller')

router.post('/add', examController.addExam)
router.post('/list', examController.listExam)
router.post('/detail/:exam_id', examController.detailExam)
router.post('/submit-answer-sheet', examController.submitAnswers)
router.post('/submissions/:exam_id', examController.submissionsForExam)
router.post('/edit', examController.editExam)
router.post('/remove', examController.removeExam)

module.exports = router