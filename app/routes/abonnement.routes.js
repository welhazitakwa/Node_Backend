const router = require('express').Router()

const abonnements = require('../controllers/abonnement.controller.js')

router.post('/', abonnements.create)
router.get('/', abonnements.findAll)
router.get('/:id', abonnements.findOne)
router.put('/:id', abonnements.update)
router.delete('/:id', abonnements.delete)
router.delete('/', abonnements.deleteAll)

module.exports = router
