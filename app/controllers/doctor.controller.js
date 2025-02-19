const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const Doctor = db.doctor
const User = db.user
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: doctors } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, doctors, totalPages, currentPage }
}
exports.create = async (req, res) => {
  try {
    if (!req.body.experience) {
      res.status(400).send({
        message: 'Content can not be empty!',
      })
      return
    }

    Doctor.create({
      //experience: req.body.experience,
      iduser: req.body.id,
    }).then((doctor) => {
      return res.send(doctor)
    })
  } catch (error) {
    console.log(error)
    return res.send(`Error when trying upload images: ${error}`)
  }
}
// exports.findAll = (req, res) => {
//   const idspc = req.query.idspc
//   Doctor.getAll(idspc,(err,data))
//      if (err)
//       res.status(500).send({
//         message:
//           err.message ||
//           'Some error occurred while retrieving recommandations.',
//       })
//     else res.send(data)
// }
exports.findAll = async(req, res) => {
  const data = await sql
    .query(
      `SELECT utilisateurs.id as u_id , doctors.id,doctors.iduser, utilisateurs.nom as nom_d , utilisateurs.prenom as prenom_d , utilisateurs.avatar, specialites.nom as nomsp , doctors.adressCabinet, doctors.cabinet, doctors.cabState, doctors.cabTel ,doctors.cabCP, doctors.cabService from doctors , utilisateurs , specialites where utilisateurs.id = doctors.iduser and doctors.idspc = specialites.id and doctors.idabn_idx IS NOT NULL`
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
  Doctor.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving doctors.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  let condition = { iduser: { [Op.eq]: `${id}` } }
  Doctor.findOne({ where: condition })
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Doctor with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Doctor with id=' + id,
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id

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

          console.log('------------------------------------' + req.body.MF),
            Doctor.update(
              {
                MF: req.body.MF,
                RC: req.body.RC,
                cabinet: req.body.cabinet,
                adressCabinet: req.body.adressCabinet,
                hopital: req.body.hopital,
                from: req.body.from,
                to: req.body.to,
                design: req.body.design,
                award: req.body.award,
                yearAward: req.body.yearAward,
                membership: req.body.membership,
                registration: req.body.registration,
                yearRegistration: req.body.yearRegistration,
                cabAdress: req.body.cabAdress,
                cabTel: req.body.cabTel,
                cabCity: req.body.cabCity,
                cabCP: req.body.cabCP,
                cabState: req.body.cabState,
                cabService: req.body.cabService,
                degree: req.body.degree,
                institut: req.body.institut,
                yearDegree: req.body.yearDegree,
                description: req.body.description,
                idspc: req.body.idspc,
                idabn_idx: req.body.idabn_idx,
              },
              {
                where: { iduser: id },
              }
            )
              .then((num) => {
                if (num == 1) {
                  res.send({
                    message: 'Doctor was updated successfully.',
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
exports.delete = (req, res) => {
  const id = req.params.id
  Doctor.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Doctor was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Doctor with id=${id}. Maybe Doctor was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Doctor with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Doctor.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Doctors were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Doctors.',
      })
    })
}
// exports.findAllDoctorAbn = async (req, res) => {
//   //const id = req.params.idspc
//   const data = await sql
//     .query(
//       `SELECT utilisateurs.id as u_id , doctors.id as id_d , utilisateurs.nom as nom_d , utilisateurs.prenom as prenom_d , doctors.idspc as id_sp, specialites.nom as nomsp , doctors.idabn_idx , utilisateurs.avatar as avatar_d, specialites.image as image_d from doctors , utilisateurs , specialites where utilisateurs.id = doctors.iduser and doctors.idspc = specialites.id and doctors.idabn_idx IS NOT NULL`
//     )
//     .then((data) => {
//       console.log('data : ', data[0])
//       res.send(data[0])
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Some error occurred while retrieving membres.',
//       })
//     })
// }
exports.Search = async (req, res) => {
  const { nom, idspc, genre } = req.query
  let condition1 = nom ? `and utilisateurs.nom LIKE  '%${nom}%'` : ''
  let condition2 = idspc ? `and doctors.idspc = ${idspc}` : ''
  let condition3 = genre ? `and utilisateurs.genre = '${genre}'` : ''

  const data = await sql
    .query(
      `SELECT utilisateurs.id as u_id , doctors.id as id_d ,doctors.iduser, utilisateurs.nom as nom_d , utilisateurs.prenom as prenom_d , utilisateurs.avatar, specialites.nom as nomsp , doctors.adressCabinet, doctors.cabinet, doctors.cabState, doctors.cabTel ,doctors.cabCP, doctors.cabService from doctors , utilisateurs , specialites where utilisateurs.id = doctors.iduser and doctors.idspc = specialites.id and doctors.idabn_idx IS NOT NULL  ${condition1}  ${condition2}  ${condition3}`
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
exports.updateRating = (req, res) => {
  const id = req.params.id
  console.log('iiiiiiiidddddddddddddddd',id)
  Doctor.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Rating was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Rating`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Rating with id=' + id,
      })
    })
}