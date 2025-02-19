const router = require('express').Router()

const factures = require('../controllers/facture.controller.js')

router.post('/', factures.create)
router.get('/', factures.findAll)
router.get('/:id', factures.findOne)
router.put('/:id', factures.update)
router.delete('/:id', factures.delete)
router.delete('/', factures.deleteAll)
router.get('/byBordFac/:id', factures.findBordOfFacture)
router.get('/byFacPat/:id', factures.findFactureOfPatient)
router.get('/byFacDoc/:id', factures.findFactureOfDoctor)

module.exports = router
