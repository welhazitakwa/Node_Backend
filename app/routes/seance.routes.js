const router = require('express').Router()

const seances = require('../controllers/seance.controller.js')

router.post('/', seances.create)
router.get('/', seances.findAll)
//router.get('/published', seances.findAllPublished)
router.get('/:id', seances.findOne)
router.put('/:id', seances.update)
router.delete('/:id', seances.delete)
router.delete('/', seances.deleteAll)

module.exports = router
