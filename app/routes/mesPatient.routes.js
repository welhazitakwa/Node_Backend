const router = require('express').Router()

const mesPatients = require('../controllers/mesPatient.controller.js')

router.post('/', mesPatients.create)
router.post('/rating', mesPatients.createRating)
router.get('/', mesPatients.findAll)
router.get('/moyRating', mesPatients.findRatingDoctor)
router.get('/utilisateurs', mesPatients.findAllUtilisateurs)
router.get('/:id', mesPatients.findOne)
router.put('/:id', mesPatients.update)
router.delete('/:id', mesPatients.delete)
router.delete('/', mesPatients.deleteAll)
router.get('/bydocP/:id', mesPatients.findMesPatientOfDoctor)
router.get('/bypatD/:id', mesPatients.findDemandesPatient)

module.exports = router
