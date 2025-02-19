const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Operation = db.operation
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: operations } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, operations, totalPages, currentPage }
}
exports.create = async (req, res) => {
 
    Operation.create({
      description: req.body.description,
      lieu: req.body.lieu,
      date: req.body.date,
      temps: req.body.temps,
      raisons: req.body.raisons,
      resultat: req.body.resultat,
      idConslt: req.body.idConslt,
    }).then((operation) => {
      return res.send(operation)
    })
  
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  Operation.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Operations.',
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id
  Operation.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Analyse was Operation successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Operation with id=${id}. Maybe Analyse was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Analyse with id=' + id,
      })
    })
}
exports.findOperationOfPatient = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser , consultations.id as idConst , operations.id as idOp, operations.lieu as operation_lieu , operations.status as status, operations.remarqueRS as rqOp, operations.createdAt as Plann_Op,
      operations.description as operation_desc , consultations.createdAt as consultation_date, operations.date as operation_date , operations.temps as tempsOp ,
      operations.resultat as opRes , operations.raisons as operation_raisons, specialites.nom as nomS,
      operations.lieu as operation_lieu , consultations.idDo as conslDocId , utilisateurs.nom as nomD, utilisateurs.prenom as prenomD , utilisateurs.avatar as avatarD
      FROM utilisateurs join consultations on utilisateurs.id = consultations.idDo join doctors on consultations.idDo = doctors.iduser join specialites
      on  doctors.idspc= specialites.id join operations on operations.idConslt =  consultations.id
      WHERE utilisateurs.id = consultations.idDo and operations.idConslt = consultations.id and consultations.idPat =${patId}
      order by operations.createdAt desc`
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
exports.donneeOp = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `select consultations.createdAt as consultation_date , utilisateurs.nom as nom_patient, utilisateurs.prenom as prenom_patient , utilisateurs.UI as UI_patient
      from consultations  join utilisateurs on utilisateurs.id = consultations.idPat
      where consultations.id=${patId}`
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
exports.findOperationOfPatientDoc = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser , consultations.id as idConst , operations.id as idOp, operations.lieu as operation_lieu , operations.remarqueRS as rqOp,operations.status as status, operations.createdAt as ordOp,
      operations.description as operation_desc , consultations.createdAt as consultation_date, operations.date as operation_date , operations.temps as tempsOp ,
      operations.resultat as opRes , operations.raisons as operation_raisons, specialites.nom as nomS,
      operations.lieu as operation_lieu , consultations.idDo as conslDocId , utilisateurs.nom as nomD, utilisateurs.prenom as prenomD , utilisateurs.avatar as avatarD
      FROM utilisateurs join consultations on utilisateurs.id = consultations.idDo join doctors on consultations.idDo = doctors.iduser join specialites
      on  doctors.idspc= specialites.id join operations on operations.idConslt =  consultations.id
      WHERE utilisateurs.id = consultations.idDo and operations.idConslt = consultations.id and consultations.id =${patId}
      order by ordOp desc`
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

























exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Operation.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving operations.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Operation.findByPk(id)
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
  Operation.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Operation was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Operation with id=${id}. Maybe Operation was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Operation with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Operation.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Operation was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Operation with id=${id}. Maybe Operation was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Operation with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Operation.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Operations were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Operations.',
      })
    })
}
