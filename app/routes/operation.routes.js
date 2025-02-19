const router = require('express').Router()

const operations = require('../controllers/operation.controller.js')

router.post('/', operations.create)
router.get('/', operations.findAll)
///router.get('/published', operations.findAllPublished)
router.get('/:id', operations.findOne)
router.put('/:id', operations.update)
router.delete('/:id', operations.delete)
router.delete('/', operations.deleteAll)
router.get('/byPaOp/:id', operations.findOperationOfPatient)
router.get('/byPaOpDo/:id', operations.findOperationOfPatientDoc)
router.get('/byIdConslt/:id', operations.donneeOp)

module.exports = router
