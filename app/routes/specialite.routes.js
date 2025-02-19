const router = require('express').Router()

const specialites = require('../controllers/specialite.controller.js')

router.post('/', specialites.create)
router.get('/', specialites.findAll)
//router.get('/published', specialites.findAllPublished)
router.get('/:id', specialites.findOne)
router.put('/:id', specialites.update)
router.delete('/:id', specialites.delete)
router.delete('/', specialites.deleteAll)

module.exports = router
