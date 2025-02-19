const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const CadreMedical = db.cadreMedical
const User = db.user
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: cadreMedicals } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, cadreMedicals, totalPages, currentPage }
}

exports.create = async (req, res) => {
 
    CadreMedical.create({
      mission: req.body.mission,
      idCuser: req.body.idCuser,
      idMed: req.body.idMed,
    }).then((cadreMedical) => {
      return res.send(cadreMedical)
    })
  
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  CadreMedical.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving CadreMedicals.',
      })
    })
}

exports.findCadreMedicalOfDoctor = async (req, res) => {
  const doctId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser , cadreMedicals.id as idCd ,utilisateurs.nom as nom_cadre, utilisateurs.prenom as prenom_cadre , utilisateurs.tel as tel_cadre,
      utilisateurs.adresse as adresse_cadre , utilisateurs.dateNaissance as naissance ,
      utilisateurs.email as email_cadre , cadreMedicals.mission as miss_cadre 
             FROM utilisateurs , cadreMedicals
       WHERE utilisateurs.id = cadreMedicals.idCuser and cadreMedicals.idMed = ${doctId}`
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
  CadreMedical.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Cadre Medical was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Cadre Medical with id=${id}. Maybe Cadre was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Cadre with id=' + id,
      })
    })
}
// exports.delete = async (req, res) => {
//   const id = req.params.id
//   const data = await sql
//     .query(`DELETE * FROM cadreMedicals where idCuser = ${id}`)
//     .then(() => {
//       console
//         .log('cadre was deleted successfully!')
//         .query(`DELETE * FROM utilisateurs where id = ${id}`)
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Some error occurred while retrieving membres.',
//       })
//     })
// }
exports.delete = (req, res) => {
  const id = req.params.id
  console.log(id)
  CadreMedical.destroy({
    where: { idCuser: id },
  })
    .then((num) => {
      if (num == 1) {
        User.destroy({
          where: {id:id}
        })
        res.send({
          message: 'cadre was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete cadre with id=${id}. Maybe cadre was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete cadre with id=' + id,
      })
    })
    

}

exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  CadreMedical.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving cadreMedicals.',
      })
    })
}
exports.findOne = async (req, res) => {
  const id = req.params.id
  //console.log('??????????????????????',id)
  const data = await sql
    .query(`SELECT * FROM cadreMedicals where idCuser = ${id}`)
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
// exports.findOne = (req, res) => {
//   const id = req.params.id
//   let condition = { idCuser: { [Op.eq]: `${id}` } }
//   Doctor.findOne({ where: condition })
//     .then((data) => {
//       if (data) {
//         res.send(data)
//       } else {
//         res.status(404).send({
//           message: `Cannot find Doctor with id=${id}.`,
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Error retrieving Doctor with id=' + id,
//       })
//     })
// }
// exports.findOne = (req, res) => {
//   const id = req.params.id
//   CadreMedical.findByPk(id)
//     .then((data) => {
//       if (data) {
//         res.send(data)
//       } else {
//         res.status(404).send({
//           message: `Cannot find Speciallite with id=${id}.`,
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Error retrieving Speciallite with id=' + id,
//       })
//     })
// }
exports.update = (req, res) => {
  const id = req.params.id
  CadreMedical.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'CadreMedical was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update CadreMedical with id=${id}. Maybe CadreMedical was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating CadreMedical with id=' + id,
      })
    })
}
// exports.delete = (req, res) => {
//   const id = req.params.id
//   CadreMedical.destroy({
//     where: { id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: 'CadreMedical was deleted successfully!',
//         })
//       } else {
//         res.send({
//           message: `Cannot delete CadreMedical with id=${id}. Maybe CadreMedical was not found!`,
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Could not delete CadreMedical with id=' + id,
//       })
//     })
// }
exports.deleteAll = (req, res) => {
  CadreMedical.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} CadreMedicals were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all CadreMedicals.',
      })
    })
}
