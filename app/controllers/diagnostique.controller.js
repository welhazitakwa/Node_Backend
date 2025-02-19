const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Diagnostique = db.diagnostique
const Op = db.Sequelize.Op
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: diagnostiques } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, diagnostiques, totalPages, currentPage }
}

exports.create = async (req, res) => {
  try {
    console.log(req.file)
    //valisate request
    if (!req.body.observation) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    /*if (req.file == undefined) {
      return res.send(`You must select a image.`)
    }*/
    Diagnostique.create({
      observation: req.body.observation,
      date: req.body.date,
    }).then((diagnostique) => {
      return res.send(diagnostique)
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
  Diagnostique.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Diagnostiques.',
      })
    })
}
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Diagnostique.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving diagnostiques.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Diagnostique.findByPk(id)
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
  Diagnostique.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Diagnostique was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Diagnostique with id=${id}. Maybe Diagnostique was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Diagnostique with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Diagnostique.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Diagnostique was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Diagnostique with id=${id}. Maybe Diagnostique was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Diagnostique with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Diagnostique.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Diagnostiques were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Diagnostiques.',
      })
    })
}
