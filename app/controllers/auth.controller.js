const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Patient = db.patient
const Doctor = db.doctor
const Role = db.role
const RefreshToken = db.refreshToken
//const { user: User, role: Role, refreshToken: RefreshToken } = db
const Op = db.Sequelize.Op
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    UI: req.body.ui,
    nom: req.body.nom,
    prenom: req.body.prenom,
    cin: req.body.cin,
    tel: req.body.tel,
    email: req.body.email,
    // adresse: req.body.adresse,
    //dateNaissance: req.body.dateNaissance,
    login: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    // profil: req.body.profil,
    // permissions: req.body.permissions,
    avatar: 'http://192.168.43.97:8090/uploads/default.png',
    // date_ins: req.body.date_ins,
    // etat: req.body.etat,
    // gouvernorat: req.body.gouvernorat,
    // cpostal: req.body.cpostal,
    // genre: req.body.genre,
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            if (roles.length == 1) {
              Doctor.create({
                iduser: user.id,
              })
                .then(() =>
                  res.send({ message: 'Médecin inscrit avec succès !' })
                )
                .catch((err) => {
                  res.status(500).send({ message: err.message })
                })
            } else if (roles.length == 2) {
              Patient.create({
                //profession: 'dddwa',
                iduserP: user.id,
              })
                .then(() =>
                  res.send({ message: 'Patient inscrit avec succès !' })
                )
                .catch((err) => {
                  res.status(500).send({ message: err.message })
                })
            }
          })
        })
      } else {
        // user role = 5
        user.setRoles([5]).then(() => {
          Patient.create({
            // profession: 'dddwa',
            // iduserP: user.id,
          })
            .then(() =>
              res.send({
                message: 'L’utilisateur a été enregistré avec succès!',
              })
            )
            .catch((err) => {
              res.status(500).send({ message: err.message })
            })
        })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
}

exports.signin = (req, res) => {
  User.findOne({
    where: {
      login: req.body.username,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: 'Utilisateur non trouvé' })
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      )
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Mot de passe invalide !',
        })
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      })

      let refreshToken = await RefreshToken.createToken(user)
      let permissions = []

      user.getRoles().then((roles) => {
        // [0] 1 admin, [1] 3 patient
        for (let i = 0; i < roles.length; i++) {
          //i = 1
          permissions.push('ROLE_' + roles[i].name.toUpperCase())
          // permissions = ["ROLE_ADMIN","ROLE_PATIENT" ]
        }
        res.status(200).send({
          id: user.id,
          username: user.login,
          UI: user.UI,
          cin: user.cin,
          nom: user.nom,
          prenom: user.prenom,
          tel: user.tel,
          email: user.email,
          adresse: user.adresse,
          dateNaissance: user.dateNaissance,
          profil: user.profil,
          permissions: user.permissions,
          avatar: user.avatar,
          etat: user.etat,
          genre: user.genre,
          gouvernorat: user.gouvernorat,
          cpostal: user.cpostal,
          roles: permissions,
          accessToken: token,
          refreshToken: refreshToken,
        })
      })
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
}

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body
  if (requestToken == null) {
    return res.status(403).json({ message: 'Refresh Token is required!' })
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    })
    console.log(refreshToken)
    if (!refreshToken) {
      res.status(403).json({ message: 'Refresh token is not in database!' })
      return
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } })

      res.status(403).json({
        message: 'Refresh token was expired. Please make a new signin request',
      })
      return
    }
    const user = await refreshToken.getUser()
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    })
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    })
  } catch (err) {
    return res.status(500).send({ message: err })
  }
}
