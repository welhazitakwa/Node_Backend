const fs = require('fs')
const db = require('../models')
const config = require('../config/auth.config')
const MesPatient = db.mesPatient
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: mesPatients } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, mesPatients, totalPages, currentPage }
}
// exports.create = async (req, res) => {
//   try {
//     console.log(req.file)
//     //valisate request
//     if (!req.body.demande) {
//       res.status(400).send({
//         message: 'Content can not be empty!',
//       })
//       return
//     }

//     MesPatient.create({
//       demande: req.body.demande,
//     }).then((mesPatient) => {
//       return res.send(mesPatient)
//     })
//   } catch (error) {
//     console.log(error)
//     return res.send(`Error when trying upload images: ${error}`)
//   }
// }
exports.findAllUtilisateurs = async (req, res) => {
  const data = await sql
    .query(`SELECT UI as UI FROM utilisateurs`)
    .then((data) => {
      console.log('data : ', data[0])
      res.send(data[0])
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving specialites.',
      })
    })
}
exports.create = async (req, res) => {
  await MesPatient.create({
    demande: req.body.demande,
    UIPa: req.body.UIPa,
    idUserD: req.body.idUserD,
    //idUserPa: req.body.idUserPa,
  })
    .then((mesPatient) => {
      console.log(mesPatient)
      return res.send(mesPatient)
    })
    .catch((err) => {
      res.status(500).send({
        message: "Aucun patient n'est trouvé avec cette identité universelle !",
      })
    })
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  MesPatient.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving MesPatients.',
      })
    })
}
exports.findMesPatientOfDoctor = async (req, res) => {
  const doctId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser, utilisateurs.nom as patient_nom,utilisateurs.avatar as patient_avtr, utilisateurs.email as patient_email, utilisateurs.prenom as patient_prenom, mesPatients.id as idrdv , utilisateurs.dateNaissance as patient_date , utilisateurs.adresse as addPat , utilisateurs.tel as patient_tel , utilisateurs.cin as patient_cin, utilisateurs.UI as UI , utilisateurs.genre as genderPat , mesPatients.demande as etat, mesPatients.idUserPa as idUserPa
      FROM utilisateurs, mesPatients WHERE utilisateurs.UI = mesPatients.UIPa and mesPatients.idUserD= ${doctId}`
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
exports.findDemandesPatient = async (req, res) => {
  const patId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as idDoctor,utilisateurs.UI as uiDoc, utilisateurs.nom as doctor_nom,utilisateurs.avatar as doctor_avtr, utilisateurs.prenom as doctor_prenom, mesPatients.id as idDemande,  utilisateurs.tel as doc_tel , utilisateurs.genre as doctor_genre, mesPatients.createdAt as date_envoi , mesPatients.updatedAt as date_reponse , mesPatients.demande as etat FROM utilisateurs join mesPatients on utilisateurs.id=mesPatients.idUserD WHERE mesPatients.UIPa = '${patId}'`
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
exports.findOne = (req, res) => {
  const id = req.params.id
  MesPatient.findByPk(id)
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
  MesPatient.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'MesPatient was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update MesPatient with id=${id}. Maybe MesPatient was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating MesPatient with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  MesPatient.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'MesPatient was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete MesPatient with id=${id}. Maybe MesPatient was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete MesPatient with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  MesPatient.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} MesPatients were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all MesPatients.',
      })
    })
}
exports.createRating = async (req, res) => {
  await MesPatient.create({
    note: req.body.note,
    idUserPa: req.body.idUserPa,
    idUserD: req.body.idUserD,
    //idUserPa: req.body.idUserPa,
  })
    .then((mesPatient) => {
      console.log(mesPatient)
      return res.send(mesPatient)
    })
    .catch((err) => {
      res.status(500).send({
        message: "Rating n'est pas enregistré !",
      })
    })
}
exports.findRatingDoctor = async (req, res) => {
  const data = await sql
    .query(
      `SELECT AVG(note) as moyenne,idUserD as doctorId ,count(*) as somme
       FROM mesPatients
       group by idUserD`
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
