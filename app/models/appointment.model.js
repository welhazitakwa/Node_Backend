module.exports = (sequelize, Sequelize) => {
  const Appointment = sequelize.define('appointments', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dateRendezVous: {
      type: Sequelize.STRING,
    },
    maladie: {
      type: Sequelize.STRING,
    },
    prix: {
      type: Sequelize.FLOAT,
    },
    etat: {
      type: Sequelize.INTEGER,
    },
    temps: {
      type: Sequelize.STRING,
    },
    idDoc: {
      type: Sequelize.INTEGER,
    },
    idPa: {
      type: Sequelize.INTEGER,
    },
  })

  return Appointment
}
