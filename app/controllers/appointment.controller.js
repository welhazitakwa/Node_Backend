const db = require('../models')
const Appointment = db.appointment
const Op = db.Sequelize.Op
const sql = db.sequelize
const getPagination = (page, size) => {
  const limit = size ? +size : 3
  const offset = page ? page * limit : 0
  return { limit, offset }
}
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: appointments } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalItems / limit)
  return { totalItems, appointments, totalPages, currentPage }
}
exports.create = async (req, res) => {
     Appointment.create({
      temps: req.body.temps,
      dateRendezVous: req.body.dateRendezVous,
      maladie: req.body.maladie,
      //prix: req.body.prix,
      etat: req.body.etat,
      idDoc: req.body.idDoc,
      idPa: req.body.idPa,
    })
      .then((appointment) => {
        return res.send(appointment)
      })
      .catch((err) => {
        res.status(500).send({
          message:
            "demande de rendez-vous n'est pas envoyer",
        })
      })
  
}
exports.findAll = (req, res) => {
  const { page, size, nom } = req.query
  let condition = nom ? { nom: { [Op.like]: `%${nom}%` } } : null
  const { limit, offset } = getPagination(page, size)
  Appointment.findAndCountAll({ where: condition, limit, offset })
    .then((data) => {
      const response = getPagingData(data, page, limit)
      console.log(response)
      res.send(response)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving Appointments.',
      })
    })
}
exports.findRdvOfDoctor = async (req, res) => {
  const doctId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser,utilisateurs.tel as telephone_patient, utilisateurs.avatar as avatar_patient, appointments.temps as time, appointments.maladie as maladies,
      utilisateurs.email as email_patient, utilisateurs.nom as patient_nom,  
      utilisateurs.prenom as patient_prenom,appointments.id as idrdv, appointments.dateRendezVous as date_RDV, appointments.etat as etat , utilisateurs.avatar as avatar_patient , utilisateurs.UI as UI
      FROM utilisateurs, appointments WHERE utilisateurs.id = appointments.idPa and appointments.idDoc = ${doctId}`
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
exports.findRdvOfPatient = async (req, res) => {
  const PaId = req.params.id
  const data = await sql
    .query(
      `SELECT utilisateurs.id as iduser ,utilisateurs.tel as tel_Doctor, utilisateurs.avatar as avatar,
       utilisateurs.nom as nom_doctor, utilisateurs.prenom as prenom_doctor , appointments.id as idrdv, appointments.dateRendezVous as date_RDV,appointments.temps as temps, appointments.etat as etat , doctors.adressCabinet , doctors.cabCity , doctors.cabState, doctors.cabTel , doctors.cabinet FROM utilisateurs, appointments , doctors WHERE utilisateurs.id = appointments.idDoc and appointments.idDoc = doctors.iduser and appointments.idPa = ${PaId}`
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
  Appointment.findByPk(id)
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
  Appointment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Appointment was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Appointment with id=${id}. Maybe Appointment was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Appointment with id=' + id,
      })
    })
}
exports.delete = (req, res) => {
  const id = req.params.id
  Appointment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: 'Appointment was deleted successfully!',
        })
      } else {
        res.send({
          message: `Cannot delete Appointment with id=${id}. Maybe Appointment was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Appointment with id=' + id,
      })
    })
}
exports.deleteAll = (req, res) => {
  Appointment.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Appointments were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all Appointments.',
      })
    })
}
