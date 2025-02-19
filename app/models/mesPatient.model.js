module.exports = (sequelize, Sequelize) => {
  const MesPatient = sequelize.define('mesPatients', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    demande: {
      type: Sequelize.STRING,
    },
    idUserD: {
      type: Sequelize.INTEGER,
    },
    idUserPa: {
      type: Sequelize.INTEGER,
    },
    UIPa: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.FLOAT,
    },
  })

  return MesPatient
}
