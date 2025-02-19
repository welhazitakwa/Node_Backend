const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Ordonnance = db.ordonnance
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: ordonnances } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, ordonnances, totalPages, currentPage }
}

exports.create = async (req, res) => {
  
    Ordonnance.create({
      description: req.body.description,
      idConsltO: req.body.idConsltO
    }).then((ordonnance) => {
      return res.send(ordonnance)
    })
 
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  Ordonnance.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Ordonnances.',
      })
    })
}
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Ordonnance.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving ordonnances.',
      })
    })
}
exports.findOrdonnanceOfPatient = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT ordonnances.idConsltO as idConst , ordonnances.id , specialites.nom as nomS,
ordonnances.createdAt as ordonnances_date,  utilisateurs.nom as nomD ,utilisateurs.prenom as prenomD, ordonnances.description as description, utilisateurs.avatar as avatarD
FROM utilisateurs join consultations on utilisateurs.id = consultations.idDo join doctors on consultations.idDo = doctors.iduser join specialites
on  doctors.idspc= specialites.id join ordonnances on ordonnances.idConsltO = consultations.id where consultations.idPat = ${patId}
order by ordonnances_date desc`
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
exports.findOrdonnanceOfPatientAllDoctor = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `select consultations.id as idConst, ordonnances.id as idOrd, ordonnances.description as description,ordonnances.createdAt as consultation_date,utilisateurs.nom as nomD, utilisateurs.prenom as pnomD , specialites.nom as nomS , doctors.adressCabinet as adressCabinet,doctors.cabCity as cabCity, doctors.cabCP as cabCP, doctors.cabinet as cabinet , ordonnances.createdAt as createdAt, utilisateurs.avatar as avatar_Ord
      from ordonnances join consultations on ordonnances.idConsltO = consultations.id join utilisateurs on utilisateurs.id =consultations.idDo join doctors on utilisateurs.id = doctors.iduser join specialites on doctors.idspc = specialites.id where consultations.id = ${patId}`
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


exports.findOrdonnanceOfPatientAllDoctorConsultation = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `select consultations.id as idConst, ordonnances.id as idOrd, ordonnances.description as description,ordonnances.createdAt as consultation_date,utilisateurs.nom as nomD, utilisateurs.prenom as pnomD , specialites.nom as nomS , doctors.adressCabinet as adressCabinet,doctors.cabCity as cabCity, doctors.cabCP as cabCP, doctors.cabinet as cabinet , ordonnances.createdAt as createdAt, utilisateurs.avatar as avatar_Ord
      from ordonnances join consultations on ordonnances.idConsltO = consultations.id join utilisateurs on utilisateurs.id =consultations.idDo join doctors on utilisateurs.id = doctors.iduser join specialites on doctors.idspc = specialites.id where ordonnances.id = ${patId}`
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

























exports.findOne = (req, res) => {
  const id = req.params.id
  Ordonnance.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Speciallite with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Speciallite with id=' + id,
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id
  Ordonnance.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Ordonnance was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Ordonnance with id=${id}. Maybe Ordonnance was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Ordonnance with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Ordonnance.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Ordonnance was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Ordonnance with id=${id}. Maybe Ordonnance was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Ordonnance with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Ordonnance.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Ordonnances were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Ordonnances.',
      })
    })
}
