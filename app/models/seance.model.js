module.exports = (sequelize, Sequelize) => {
  const Seance = sequelize.define('seances', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date: {
      type: Sequelize.STRING,
    },
    Traitement: {
      type: Sequelize.STRING,
    },
    duree: {
      type: Sequelize.INTEGER,
    },
    etat: {
      type: Sequelize.INTEGER,
    },
  })

  return Seance
}
