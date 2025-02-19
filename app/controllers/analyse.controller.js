const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Analyse = db.analyse
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: analyses } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, analyses, totalPages, currentPage }
}
exports.create = async (req, res) => {
 
    Analyse.create({
      nom: req.body.nom,
      date: req.body.date,
      resultat: req.body.resultat,
      etat: req.body.etat,
      idConsltA: req.body.idConsltA,
    }).then((analyse) => {
      return res.send(analyse)
    })
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  Analyse.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Analyses.',
      })
    })
}
exports.findAnalyseOfPatient = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT consultations.id as idConst , analyses.id as idas, analyses.status as status, analyses.createdAt as analyse_Ord
      ,consultations.createdAt as consultation_date , analyses.nom as nom_analyse , analyses.date as date_analyse , 
analyses.nomLabo as analyse_nomLabo , analyses.prix as analyse_prix , analyses.resultat as analyse_resultat , 
analyses.etat as analyse_etat  , consultations.idDo as conslDocId , utilisateurs.nom as nomD,
utilisateurs.prenom as prenomD, utilisateurs.avatar as avatarD, specialites.nom as nomS
from analyses join consultations on analyses.idConsltA = consultations.id join utilisateurs on utilisateurs.id =consultations.idDo join doctors on utilisateurs.id = doctors.iduser join specialites on doctors.idspc = specialites.id where consultations.idPat = ${patId}
order by analyse_Ord desc`
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
exports.findAnalyseOfPatientDoc = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT consultations.id as idConst , analyses.id as idas, analyses.status as status,
        consultations.createdAt as consultation_date , analyses.nom as nom_analyse , analyses.date as date_analyse , analyses.createdAt as ord_Ana,
        analyses.nomLabo as analyse_nomLabo , analyses.prix as analyse_prix , analyses.resultat as analyse_resultat , 
        analyses.etat as analyse_etat  , consultations.idDo as conslDocId , utilisateurs.nom as nomD,
        utilisateurs.prenom as prenomD, utilisateurs.avatar as avatarD, specialites.nom as nomS
        from analyses join consultations on analyses.idConsltA = consultations.id join utilisateurs on utilisateurs.id =consultations.idDo join doctors on utilisateurs.id = doctors.iduser join specialites on doctors.idspc = specialites.id where consultations.id = ${patId}
        order by ord_Ana desc`
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
exports.update = (req, res) => {
  const id = req.params.id
  Analyse.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Analyse was Operation successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Analyse with id=${id}. Maybe Analyse was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Analyse with id=' + id,
      })
    })
}































exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Analyse.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving analyses.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Analyse.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Analyse with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Analyse with id=' + id,
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id
  Analyse.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Analyse was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Analyse with id=${id}. Maybe Analyse was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Analyse with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Analyse.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Analyse was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Analyse with id=${id}. Maybe Analyse was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Analyse with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Analyse.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Analyses were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Analyses.',
      })
    })
}
