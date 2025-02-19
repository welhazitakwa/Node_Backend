const { authJwt } = require('../middleware')
const controller = require('../controllers/utilisateur.controller')
const { upload } = require('../middleware')

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    )
    next()
  })
  app.get('/api/namespace/public', controller.allAccess)
  app.get('/api/namespace/user', [authJwt.verifyToken], controller.userBoard)

  app.get(
    '/api/namespace/admin',
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  )

  app.get(
    '/api/namespace/medecin',
    [authJwt.verifyToken, authJwt.isMedecin],
    controller.medecinBoard
  )
  app.get(
    '/api/namespace/patient',
    [authJwt.verifyToken, authJwt.isPatient],
    controller.patientBoard
  )
  app.post('/api/utilisateurs', upload.single('file'), controller.create)
  app.get('/api/utilisateurs/:id', controller.findOne)
  app.put('/api/utilisateurs/:id',controller.update)
  app.delete('/api/utilisateurs/:id', controller.delete)
  app.get('/api/utilisateurs', controller.findAll)

}
