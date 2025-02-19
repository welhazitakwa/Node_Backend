module.exports = (sequelize, Sequelize) => {
  const Consultation = sequelize.define('consultations', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tensionConslt: {
      type: Sequelize.FLOAT,
    },
    rythmeCardiqueConslt: {
      type: Sequelize.FLOAT,
    },
    glycemieConslt: {
      type: Sequelize.FLOAT,
    },
    poidsConslt: {
      type: Sequelize.FLOAT,
    },
    synthese: {
      type: Sequelize.STRING,
    },

    etat: {
      type: Sequelize.INTEGER,
    },
    idDo: {
      type: Sequelize.INTEGER,
    },
    idPat: {
      type: Sequelize.INTEGER,
    },
  })

  return Consultation
}
