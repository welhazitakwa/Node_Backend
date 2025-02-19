const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user
const { TokenExpiredError } = jwt
const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: 'Unauthorized! Access Token was expired!' })
  }
  return res.sendStatus(401).send({ message: 'Unauthorized!' })
}
verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token']
  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    })
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res)
    }
    req.userId = decoded.id
    next()
  })
}
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require Admin Role!',
      })
      return
    })
  })
}
isMedecin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'medecin') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require Medecin Role!',
      })
    })
  })
}
isPatient = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'patient') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require Patient Role!',
      })
    })
  })
}
/*isAnalysteOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'analyste') {
          next()
          return
        }
        if (roles[i].name === 'admin') {
          next()
          return
        }
      }
      res.status(403).send({
        message: 'Require Analyste or Admin Role!',
      })
    })
  })
}*/
const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isMedecin: isMedecin,
  isPatient: isPatient,
  //isAnalysteOrAdmin: isAnalysteOrAdmin,
}
module.exports = authJwt
