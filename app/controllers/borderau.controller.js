const db = require('../models')
const config = require('../config/auth.config')
const Borderau = db.borderau
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: borderauxes } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, borderauxes, totalPages, currentPage }
}

exports.create = async (req, res) => {
  try {
    Borderau.create({
      intitule: req.body.intitule,
      etat: req.body.etat,
      reference: req.body.reference,
      idMedBord: req.body.idMedBord,
    }).then((borderau) => {
      return res.send(borderau)
    })
  } catch (error) {
    console.log(error)
    return res.send(`Error when trying upload images: ${error}`)
  }
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  Borderau.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Abonnements.',
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id
  Borderau.findByPk(id)
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
  Borderau.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Borderau was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Borderau with id=${id}. Maybe Borderau was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Borderau with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  console.log('ffffffffffffffff', id)
  Borderau.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Borderau was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Borderau with id=${id}. Maybe Borderau was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Borderau with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Borderau.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Abonnements were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Abonnements.',
      })
    })
}
exports.findBordOfDoctor = async (req, res) => {
  const doctId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser, utilisateurs.avatar, doctors.MF as matFisDoc,
utilisateurs.nom as doctor_nom, utilisateurs.prenom as doctor_prenom  , borderauxes.reference , borderauxes.intitule , borderauxes.etat , borderauxes.createdAt, borderauxes.id
FROM utilisateurs  join borderauxes on utilisateurs.id = borderauxes.idMedBord join doctors on doctors.iduser = borderauxes.idMedBord 
WHERE borderauxes.idMedBord = ${doctId}`
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
