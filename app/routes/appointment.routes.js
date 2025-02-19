const router = require('express').Router()

const appointments = require('../controllers/appointment.controller.js')

router.post('/', appointments.create)
router.get('/', appointments.findAll)
//router.get('/published', appointments.findAllPublished)
router.get('/:id', appointments.findOne)
router.put('/:id', appointments.update)
router.delete('/:id', appointments.delete)
router.delete('/', appointments.deleteAll)
router.get('/bydoc/:id', appointments.findRdvOfDoctor)
router.get('/byPatient/:id', appointments.findRdvOfPatient)

module.exports = router
