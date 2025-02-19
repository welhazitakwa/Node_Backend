const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Consultation = db.consultation
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
exports.create = async (req, res) => {
  try {
    console.log(req.file)
    if (!req.body.synthese) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    Consultation.create({
      synthese: req.body.synthese,
      tensionConslt: req.body.tensionConslt,
      rythmeCardiqueConslt: req.body.rythmeCardiqueConslt,
      glycemieConslt: req.body.glycemieConslt,
      poidsConslt: req.body.poidsConslt,
      idDo: req.body.idDo,
      idPat: req.body.idPat,
    }).then((consultation) => {
      return res.send(consultation)
    })
  } catch (error) {
    console.log(error)
    return res.send(`Error when trying upload images: ${error}`)
  }
}
exports.findAll = (req, res) => {
  Consultation.findAndCountAll()
    .then((data) => {
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Consultations.',
      })
    })
}
exports.findConsultationOfPatient = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT consultations.id as idConst , consultations.etat as conslt_etat ,consultations.rythmeCardiqueConslt as rythmeCardiaque, consultations.tensionConslt as tension,
 consultations.poidsConslt as poids, consultations.glycemieConslt as glycemie,
consultations.createdAt as consultation_date,  utilisateurs.nom as nomD ,utilisateurs.prenom as prenomD, consultations.synthese as synthese, utilisateurs.avatar as avatarD, specialites.nom as nomS
FROM utilisateurs join consultations on utilisateurs.id = consultations.idDo join doctors on consultations.idDo = doctors.iduser join specialites
on  doctors.idspc= specialites.id where consultations.idPat = ${patId}
order by consultation_date desc `
    )
    .then((data) => {
      console.log('data : ', data[0])
      res.send(data[0])
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving membres.',
      })
    })
}
exports.findConsultationOfPatientDoctor = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT consultations.id as idConst , consultations.etat as conslt_etat ,consultations.rythmeCardiqueConslt as rythmeCardiaque, consultations.tensionConslt as tension,
 consultations.poidsConslt as poids, consultations.glycemieConslt as glycemie,  consultations.createdAt as consultation_date,   consultations.synthese as synthese , 
 consultations.idDo as idDo
        FROM consultations 
        where consultations.idPat = ${patId}
        order by consultation_date desc`
    )
    .then((data) => {
      console.log('data : ', data[0])
      res.send(data[0])
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving membres.',
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Consultation.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Consultation was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Consultation with id=${id}. Maybe Consultation was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Consultation with id=' + id,
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Consultation.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find consultation with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving consultation with id=' + id,
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id
  Consultation.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Consultation was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Consultation with id=${id}. Maybe Consultation was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Consultation with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Consultation.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Consultations were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Consultations.',
      })
    })
}
