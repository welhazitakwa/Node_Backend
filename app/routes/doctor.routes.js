const router = require('express').Router()
const { upload } = require('../middleware')
const doctors = require('../controllers/doctor.controller.js')

router.post('/', doctors.create)
router.get('/', doctors.findAll)
router.get('/search', doctors.Search)
//router.get('/published', doctors.findAllPublished)
router.get('/:id', doctors.findOne)
router.put('/:id', upload.single('file'), doctors.update)
router.put('/rating/:id', upload.single('file'), doctors.updateRating)
router.delete('/:id', doctors.delete)
router.delete('/', doctors.deleteAll)
//router.get('/', doctors.findAllDoctorAbn)

module.exports = router
