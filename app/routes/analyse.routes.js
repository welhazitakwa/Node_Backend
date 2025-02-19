const router = require('express').Router()

const analyses = require('../controllers/analyse.controller.js')

router.post('/', analyses.create)
router.get('/', analyses.findAll)
//router.get('/published', analyses.findAllPublished)
router.get('/:id', analyses.findOne)
router.put('/:id', analyses.update)
router.delete('/:id', analyses.delete)
router.delete('/', analyses.deleteAll)
router.get('/byPaAn/:id', analyses.findAnalyseOfPatient)
router.get('/byPaAnDo/:id', analyses.findAnalyseOfPatientDoc)

module.exports = router
