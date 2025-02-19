const express = require('express')
const cors = require('cors')
const app = express()
var corsOptions = {
  origin: '*',
}
app.use(cors(corsOptions))
// parse requests of content-type - application/json
app.use(express.json())
app.use(express.static('public'))
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

const db = require('./app/models')
const Role = db.role

db.sequelize.sync().then(() => {
  console.log('Resync Db ...')
  //initial()
})

// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync Db')
//   initial()
// })
function initial() {
  Role.create({
    id: 1,
    name: 'admin',
  })

  Role.create({
    id: 2,
    name: 'medecin',
  })

  Role.create({
    id: 3,
    name: 'patient',
  })

  Role.create({
    id: 4,
    name: 'cadreMedical',
  })

  Role.create({
    id: 5,
    name: 'user',
  })
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to INFOESPRIT WORLD.' })
})

//include Routes

const authRouter = require('./app/routes/auth.routes')
authRouter(app)
const userRouter = require('./app/routes/utilisateur.routes')
userRouter(app)
//specialites
const specialiteRouter = require('./app/routes/specialite.routes')
app.use('/api/specialites', specialiteRouter)
//analyses
const analyseRouter = require('./app/routes/analyse.routes')
app.use('/api/analyses', analyseRouter)
//appointment
const appointmentRouter = require('./app/routes/appointment.routes')
app.use('/api/appointments', appointmentRouter)
//cadreMedical
const cadreMedicalRouter = require('./app/routes/cadreMedical.routes')
app.use('/api/cadreMedicals', cadreMedicalRouter)
//consultations
const consultationRouter = require('./app/routes/consultation.routes')
app.use('/api/consultations', consultationRouter)
//diagnostique
const diagnostiqueRouter = require('./app/routes/diagnostique.routes')
app.use('/api/diagnostiques', diagnostiqueRouter)
//doctor
const doctorRouter = require('./app/routes/doctor.routes')
app.use('/api/doctors', doctorRouter)
//operation
const operationRouter = require('./app/routes/operation.routes')
app.use('/api/operations', operationRouter)
//ordonnance
const ordonnanceRouter = require('./app/routes/ordonnance.routes')
app.use('/api/ordonnances', ordonnanceRouter)
//patient
const patientRouter = require('./app/routes/patient.routes')
app.use('/api/patients', patientRouter)
//seance
/*const seanceRouter = require('./app/routes/seance.routes')
app.use('/api/seances', seanceRouter)*/
//mesPatient
const mesPatientRouter = require('./app/routes/mesPatient.routes')
app.use('/api/mesPatients', mesPatientRouter)
//abonnement
const abonnementRouter = require('./app/routes/abonnement.routes')
app.use('/api/abonnements', abonnementRouter)
//blog
const blogRouter = require('./app/routes/blog.routes')
app.use('/api/blogs', blogRouter)
//borderau
const borderauRouter = require('./app/routes/borderau.routes')
app.use('/api/borderaux', borderauRouter)
//facture
const factureRouter = require('./app/routes/facture.routes')
app.use('/api/factures', factureRouter)

// set port, listen for requests
const PORT = process.env.PORT || 8090
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`)
})
