const express = require('express')
const router = express.Router()
const circularController = require('../controllers/circular.controller')

router.post('/add', circularController.addCircular)
router.post('/edit/:circular_id', circularController.editCircular)
router.post('/remove/:circular_id', circularController.removeCircular)
router.post('/list/:type', circularController.listCircular)
router.post('/detail/:circular_id', circularController.detailCircular)

module.exports = router