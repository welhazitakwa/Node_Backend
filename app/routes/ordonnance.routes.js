const router = require('express').Router()

const ordonnances = require('../controllers/ordonnance.controller.js')

router.post('/', ordonnances.create)
router.get('/', ordonnances.findAll)
//router.get('/published', ordonnances.findAllPublished)
router.get('/:id', ordonnances.findOne)
router.put('/:id', ordonnances.update)
router.delete('/:id', ordonnances.delete)
router.delete('/', ordonnances.deleteAll)
router.get('/byPaOr/:id', ordonnances.findOrdonnanceOfPatient)
router.get('/byPaOrAllDoc/:id', ordonnances.findOrdonnanceOfPatientAllDoctor)
router.get(
  '/byPaOrAllDocCon/:id',
  ordonnances.findOrdonnanceOfPatientAllDoctorConsultation
)

module.exports = router
