const db = require('../models')
const sql = db.sequelize
const User = db.user
const Patient = db.patient
const Op = db.Sequelize.Op
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: patients } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, patients, totalPages, currentPage }
}

exports.create = async (req, res) => {
  try {
    //console.log(req.file)
    //valisate request
    if (!req.body.profession) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }
    /*if (req.file == undefined) {
      return res.send(`You must select a image.`)
    }*/
    Patient.create({
      profession: req.body.profession,

      iduserP: req.body.iduserP,
    }).then((patient) => {
      return res.send(patient)
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
  Patient.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Patients.',
      })
    })
}
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Patient.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving patients.',
      })
    })
}
// exports.findOne = (req, res) => {
//   const id = req.params.id
//   let condition = { id: { [Op.eq]: `${id}` } }
//   User.findByPk({ where: condition })
//     .then((data) => {
//       if (data) {
//         res.send(data)
//       } else {
//         res.status(404).send({
//           message: `Cannot find Patient with id=${id}.`,
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Error retrieving Patient with id=' + id,
//       })
//     })
// }

exports.findOne = async (req, res) => {
  const id = req.params.id
  const data = await sql
    .query(`SELECT * FROM patients where iduserP = ${id}`)
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
  console.log(req.body.profession)
  try {
    if (req.file) {
      var imgsrc = 'http://192.168.43.97:8090/uploads/' + req.file.filename
    } else {
      var imgsrc = req.body.lastAvatar
    }

    console.log('bent lhram id : ' + imgsrc)
    User.update(
      {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        tel: req.body.tel,
        adresse: req.body.adresse,
        dateNaissance: req.body.dateNaissance,
        gouvernorat: req.body.gouvernorat,
        cpostal: req.body.cpostal,
        genre: req.body.genre,
        cin: req.body.cin,
        avatar: imgsrc,
      },
      {
        where: { id: id },
      }
    )
      .then((num) => {
        if (num == 1) {
          Patient.update(
            {
              //Patient fields
              profession: req.body.profession,

              poids: req.body.poids,
              hauteur: req.body.hauteur,
              typeSang: req.body.typeSang,
              rythmeCardiaque: req.body.rythmeCardiaque,
              glycemie: req.body.glycemie,
              allergies: req.body.allergies,
              maladiesCroniq: req.body.maladiesCroniq,
              medicamentsCroniq: req.body.medicamentsCroniq,
              nomContctUrgnce: req.body.nomContctUrgnce,
              numContctUrgnce: req.body.numContctUrgnce,
              lienParenteUrgnce: req.body.lienParenteUrgnce,
              tension: req.body.tension,
            },
            {
              where: { iduserP: id },
            }
          )
            .then((num) => {
              if (num == 1) {
                res.send({
                  message: 'Patient was updated successfully.',
                })
              } else {
                res.send({
                  message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`,
                })
              }
            })
            .catch((err) => {
              res.status(500).send({
                message: 'Error updating Doctor with id=' + id,
              })
            })
        } else {
          res.send({
            message: `Cannot update Doctor with id=${id}. Maybe Doctor was not found or req.body is empty!`,
          })
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Error updating Doctor with id=' + id,
        })
      })
  } catch (error) {
    console.log(error)
    return res.send(`Error when trying update Patient: ${error}`)
  }
}

// exports.update = (req, res) => {
//   const id = req.params.id
//   Patient.update(req.body, {
//     where: { id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: 'Patient was updated successfully.',
//         })
//       } else {
//         res.send({
//           message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`,
//         })
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: 'Error updating Patient with id=' + id,
//       })
//     })
// }

exports.delete = (req, res) => {
  const id = req.params.id
  Patient.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Patient was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Patient with id=${id}. Maybe Patient was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Patient with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Patient.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Patients were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Patients.',
      })
    })
}
