const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Seance = db.seance
const Op = db.Sequelize.Op
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: seances } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, seances, totalPages, currentPage }
}

exports.create = async (req, res) => {
  try {
    console.log(req.file)
    //valisate request
    if (!req.body.Traitement) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    /*if (req.file == undefined) {
      return res.send(`You must select a image.`)
    }*/
    Seance.create({
      date: req.body.date,
      Traitement: req.body.Traitement,
      duree: req.body.duree,
      etat: req.body.etat,
    }).then((seance) => {
      return res.send(seance)
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
  Seance.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Seances.',
      })
    })
}
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Seance.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving seances.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Seance.findByPk(id)
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
  Seance.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Seance was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Seance with id=${id}. Maybe Seance was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Seance with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Seance.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Seance was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Seance with id=${id}. Maybe Seance was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Seance with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Seance.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Seances were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Seances.',
      })
    })
}
