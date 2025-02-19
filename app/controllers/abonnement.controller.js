const db = require('../models')
const config = require('../config/auth.config')
const Abonnement = db.abonnement
const Op = db.Sequelize.Op
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: abonnements } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, abonnements, totalPages, currentPage } 
}

exports.create = async (req, res) => {
  try {
    console.log(req.file)
    //valisate request
    if (!req.body.titre) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    Abonnement.create({
      titre: req.body.titre,
      avantages: req.body.avantages,
      prix: req.body.prix,
      duree: req.body.duree,
      etat: req.body.etat,
    }).then((abonnement) => {
      return res.send(abonnement)
    })
  } catch (error) {
    console.log(error)
    return res.send(`Error when trying upload images: ${error}`)
  }
}
exports.findAll = (req, res) => {
  //const { page, size, nom } = req.query
  //let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  //const { limit, offset } = getPagination(page, size)
  Abonnement.findAndCountAll()
    .then((data) => {
      //const response = getPagingData(data, page, limit)
      console.log(data)
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Abonnements.',
      })
    })
}
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Abonnement.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving abonnements.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Abonnement.findByPk(id)
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
  Abonnement.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Abonnement was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Abonnement with id=${id}. Maybe Abonnement was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Abonnement with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Abonnement.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Abonnement was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Abonnement with id=${id}. Maybe Abonnement was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Abonnement with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Abonnement.destroy({
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
