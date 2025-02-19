const router = require('express').Router()

const diagnostiques = require('../controllers/diagnostique.controller.js')

router.post('/', diagnostiques.create)
router.get('/', diagnostiques.findAll)
//router.get('/published', diagnostiques.findAllPublished)
router.get('/:id', diagnostiques.findOne)
router.put('/:id', diagnostiques.update)
router.delete('/:id', diagnostiques.delete)
router.delete('/', diagnostiques.deleteAll)

module.exports = router