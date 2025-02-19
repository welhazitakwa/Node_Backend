const router = require('express').Router()

const consultations = require('../controllers/consultation.controller.js')

router.post('/', consultations.create)
router.get('/', consultations.findAll)
router.get('/:id', consultations.findOne)
router.put('/:id', consultations.update)
router.delete('/:id', consultations.delete)
router.delete('/', consultations.deleteAll)
router.get('/byPaCo/:id', consultations.findConsultationOfPatient)
router.get('/byPaCoDo/:id', consultations.findConsultationOfPatientDoctor)

module.exports = router
