const router = require('express').Router()

const blogs = require('../controllers/blog.controller.js')

router.post('/', blogs.create)
router.get('/', blogs.findAll)
//router.get('/published', analyses.findAllPublished)
router.get('/:id', blogs.findOne)
router.put('/:id', blogs.update)
router.delete('/:id', blogs.delete)
router.delete('/', blogs.deleteAll)

module.exports = router
