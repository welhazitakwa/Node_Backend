const db = require('../models')
const sql = db.sequelize
const Specialite = db.specialite
const Op = db.Sequelize.Op
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: specialites } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, specialites, totalPages, currentPage }
}

exports.create = async (req, res) => {
  try {
    console.log(req.file)
    //valisate request
    if (!req.body.nom) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    /*if (req.file == undefined) {
      return res.send(`You must select a image.`)
    }*/
    Specialite.create({
      nom: req.body.nom,
      image: req.body.image,
    }).then((speciallite) => {
      return res.send(speciallite)
    })
  } catch (error) {
    console.log(error)
    return res.send(`Error when trying upload images: ${error}`)
  }
}
exports.findAll = async (req, res) => {

  const data = await sql
    .query(
      `SELECT id as id, nom as nom_specialite FROM specialites`
    )
    .then((data) => {
      console.log('data : ', data[0])
      res.send(data[0])
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving specialites.',
      })
    })
}



// exports.findAll = (req, res) => {
//   const { page, size, nom } = req.query
//   let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
//   const { limit, offset } = getPagination(page, size)
//   Specialite.findAndCountAll({ where: condition, limit, offset })
//     .then((data) => {
//       const response = getPagingData(data, page, limit)
//       console.log(response)
//       res.send(response)
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message || 'Some error occurred while retrieving Specialites.',
//       })
//     })
// }
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Specialite.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving specialites.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Specialite.findByPk(id)
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
  Specialite.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Speciallite was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Speciallite with id=${id}. Maybe Speciallite was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Speciallite with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Specialite.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Speciallite was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Speciallite with id=${id}. Maybe Speciallite was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Speciallite with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Specialite.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Specialites were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Specialites.',
      })
    })
}
