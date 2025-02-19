const router = require('express').Router()

const cadreMedicals = require('../controllers/cadreMedical.controller.js')

router.post('/', cadreMedicals.create)
router.get('/', cadreMedicals.findAll)
//router.get('/published', cadreMedicals.findAllPublished)
router.get('/:id', cadreMedicals.findOne)
router.put('/:id', cadreMedicals.update)
router.delete('/:id', cadreMedicals.delete)
router.delete('/', cadreMedicals.deleteAll)
router.get('/bydocCaM/:id', cadreMedicals.findCadreMedicalOfDoctor)

module.exports = router
