module.exports = (sequelize, Sequelize) => {
  const Analyse = sequelize.define('analyses', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.STRING,
    },

    nomLabo: {
      type: Sequelize.STRING,
    },
    prix: {
      type: Sequelize.FLOAT,
    },
    resultat: {
      type: Sequelize.STRING,
    },
    etat: {
      type: Sequelize.INTEGER,
    },
    idConsltA: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  })
  return Analyse
}
