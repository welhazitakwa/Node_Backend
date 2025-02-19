const db = require('../models')
const Facture = db.facture
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: factures } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, factures, totalPages, currentPage }
}
exports.create = async (req, res) => {
     await Facture.create({
       montant: req.body.montant,
       etat: req.body.etat,
       TVA: req.body.TVA,
       IUPaBord: req.body.IUPaBord,
       idBord: req.body.idBord,
       ref: req.body.ref,
     })
       .then((facture) => {
         return res.send(facture)
       })
       .catch((err) => {
         res.status(500).send({
           message:
             "Aucun patient n'est trouvé avec cette identité universelle !",
         })
       })
  
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  Facture.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Factures.',
      })
    })
}
exports.findAllPromoted = (req, res) => {
  const { page, size } = req.query
  const { limit, offset } = getPagination(page, size)
  Facture.findAndCountAll({ where: { promoted: 1 }, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving factures.',
      })
    })
}
exports.findOne = (req, res) => {
  const id = req.params.id
  Facture.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Facture with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Facture with id=' + id,
      })
    })
}
exports.update = (req, res) => {
  const id = req.params.id
  Facture.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Facture was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Facture with id=${id}. Maybe Facture was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Facture with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Facture.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Facture was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Facture with id=${id}. Maybe Facture was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Facture with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Facture.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Factures were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Factures.',
      })
    })
}
exports.findBordOfFacture = async (req, res) => {
  const bordId = req.params.id
  console.log( req.params)
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser, utilisateurs.avatar as patient_avatar,factures.IUPaBord as facuIU, doctors.MF as MFDoc,
utilisateurs.nom as patient_nom, utilisateurs.prenom as patient_prenom  , factures.ref , factures.createdAt , factures.montant , factures.id , factures.etat, factures.TVA as TVA, borderauxes.idMedBord
FROM utilisateurs  join factures on utilisateurs.UI = factures.IUPaBord join borderauxes on factures.idBord = borderauxes.id join doctors on doctors.iduser = borderauxes.idMedBord
      where borderauxes.id =${bordId}`
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
exports.findFactureOfPatient = async (req, res) => {
  const factId = req.params.id
  console.log( req.params)
  const data = await sql
    .query(
      `SELECT utilisateurs.adresse as add_patient, utilisateurs.gouvernorat as gouver_patient, utilisateurs.cpostal as postal_patient,utilisateurs.nom as patient_nom, utilisateurs.prenom as patient_prenom , utilisateurs.tel as patient_tel,borderauxes.idMedBord , u2.nom as nom_doctor, u2.prenom as prenom_doctor, doctors.cabinet as cabinet_nom, doctors.cabAdress as cabinet_address , factures.TVA,
      doctors.cabCP as codePostal_cabinet, doctors.cabCity as city_cabinet, doctors.cabState state_cabinet, doctors.cabTel as tel_cabinet, factures.ref , factures.createdAt , factures.montant , factures.id , factures.etat
      FROM utilisateurs  join factures on utilisateurs.UI = factures.IUPaBord join borderauxes  on borderauxes.idMedBord = factures.idBord join utilisateurs u2 on u2.id=borderauxes.idMedBord join doctors on u2.id = doctors.iduser
      where factures.id =${factId}`
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


exports.findFactureOfDoctor = async (req, res) => {
  const doctId = req.params.id
  const data = await sql
    .query(
      `SELECT factures.montant 
      FROM factures, borderauxes WHERE  borderauxes.idMedBord = ${doctId}`
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
