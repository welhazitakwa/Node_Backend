const config = require('../config/db.config.js')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
})
const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.user = require('../models/utilisateur.model.js')(sequelize, Sequelize)
db.role = require('../models/role.model.js')(sequelize, Sequelize)
db.refreshToken = require('../models/refreshToken.model.js')(sequelize,Sequelize)
db.analyse = require('../models/analyse.model.js')(sequelize, Sequelize)
db.cadreMedical = require('../models/cadreMedical.model.js')(sequelize,Sequelize)
db.consultation = require('../models/consultation.model.js')(sequelize,Sequelize)
db.diagnostique = require('../models/diagnostique.model.js')(sequelize,Sequelize)
db.doctor = require('../models/doctor.model.js')(sequelize,Sequelize)
db.specialite = require('../models/specialite.model.js')(sequelize, Sequelize)
db.operation = require('../models/operation.model.js')(sequelize, Sequelize)
db.ordonnance = require('../models/ordonnance.model.js')(sequelize, Sequelize)
db.seance = require('../models/seance.model.js')(sequelize, Sequelize)
db.abonnement = require('../models/abonnement.model.js')(sequelize, Sequelize)
db.patient = require('../models/patient.model.js')(sequelize, Sequelize)
db.appointment = require('../models/appointment.model')(sequelize, Sequelize)
db.blog = require('../models/blog.model')(sequelize, Sequelize)
db.mesPatient = require('../models/mesPatient.model')(sequelize, Sequelize)
db.borderau = require('../models/borderau.model')(sequelize, Sequelize)
db.facture = require('../models/facture.model')(sequelize, Sequelize)


db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
})

db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
})

db.ROLES = ['user', 'admin', 'medecin', 'patient']
// 1user ------avoir------- 1Token
db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId',
  targetKey: 'id',
})
db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
})

db.user.hasOne(db.doctor, {
  foreignKey: 'iduser',
  targetKey: 'id',
})
db.doctor.belongsTo(db.user, {
  foreignKey: 'iduser',
  targetKey: 'id',
})


/*db.doctor.hasMany(db.specialite, { foreignKey: 'idspc' })
db.specialite.belongsTo(db.doctor, { foreignKey: 'idspc' })*/


/*
db.doctor.hasOne(db.specialite, {
  foreignKey: 'idspc',
})
db.specialite.belongsTo(db.doctor)


*/




module.exports = db
