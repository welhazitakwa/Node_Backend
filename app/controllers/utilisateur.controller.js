const db = require('../models')
const User = db.user
const sql = db.sequelize
const CadreMedical = db.cadreMedical
const Role = db.role
//const { user: User, role: Role, refreshToken: RefreshToken } = db
const Op = db.Sequelize.Op
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

exports.allAccess = (req, res) => {
  res.status(200).send('public content')
}
exports.userBoard = (req, res) => {
  res.status(200).send('User Content.')
}
exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.')
}
exports.medecinBoard = (req, res) => {
  res.status(200).send('Medecin Content.')
}
exports.patientBoard = (req, res) => {
  res.status(200).send('Patient Content.')
}
exports.create = (req, res) => {
  // var imagsrc = "http://localhost:8090/upload/" + req.file.filename
  User.create({
    UI: Date.now(),
    nom: req.body.nom,
    prenom: req.body.prenom,
    cin: req.body.cin,
    tel: req.body.tel,
    email: req.body.email,
    dateNaissance: req.body.dateNaissance,
    genre: req.body.genre,
    login: req.body.login,
    password: bcrypt.hashSync(req.body.password, 8),
    adresse: req.body.adresse,
    gouvernorat: req.body.gouvernorat,
    // avatar: imagsrc,
  })
    .then((user) => {
      user.setRoles([4]).then(() => {
        return res.send(user)
      })
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Uer with id=' + id,
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id
    User.update(
      {
        nom: req.body.nom,
        prenom: req.body.prenom,
        cin: req.body.cin,
        tel: req.body.tel,
        email: req.body.email,
        dateNaissance: req.body.dateNaissance,
        genre: req.body.genre,
        login: req.body.login,
        adresse: req.body.adresse,
        gouvernorat: req.body.gouvernorat,
      },
      {
        where: { id: id },
      }
    )
      .then((num) => {
        if (num == 1) {
          CadreMedical.update(
            {
              mission: req.body.mission,
            },
            {
              where: { idCuser: id },
            }
          )
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: 'Cadre was updated successfully.',
                })
              } else {
                res.send({
                  message: `Cannot update Cadre with id=${id}. Maybe Cadre was not found or req.body is empty!`,
                })
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: 'Error updating Cadre with id=' + id,
              })
            })
        } else {
          res.send({
            message: `Cannot update Cadre with id=${id}. Maybe Cadre was not found or req.body is empty!`,
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Cadre with id=' + id,
        })
      })
  
}
exports.delete = (req, res) => {
  const id = req.params.id
  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Utilisateur was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Utilisateur with id=${id}. Maybe Utilisateur was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Utilisateur with id=' + id,
      })
    })
}
exports.findAll = async (req, res) => {
  const data = await sql
    .query(`SELECT UI as UI FROM utilisateurs`)
    .then((data) => {
      console.log('data : ', data[0])
      res.send(data[0])
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving specialites.',
      })
    })
}
