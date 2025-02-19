const router = require('express').Router()

const borderaux = require('../controllers/borderau.controller.js')

router.post('/', borderaux.create)
router.get('/', borderaux.findAll)
router.get('/bydocBord/:id', borderaux.findBordOfDoctor)
router.get('/:id', borderaux.findOne)
router.put('/:id', borderaux.update)
router.delete('/:id', borderaux.delete)
router.delete('/', borderaux.deleteAll)

module.exports = router
