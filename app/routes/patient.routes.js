const router = require('express').Router()
const { upload } = require('../middleware')

const patients = require('../controllers/patient.controller.js')

router.post('/', patients.create)
router.get('/', patients.findAll)
//router.get('/published', patients.findAllPublished)
router.get('/:id', patients.findOne)

router.put('/:id', upload.single('file'), patients.update)

router.delete('/:id', patients.delete)
router.delete('/', patients.deleteAll)

module.exports = router
