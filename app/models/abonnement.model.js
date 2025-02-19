module.exports = (sequelize, Sequelize) => {
  const Abonnement = sequelize.define('abonnements', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titre: {
      type: Sequelize.STRING,
    },
    avantages: {
      type: Sequelize.STRING,
    },
    prix: {
      type: Sequelize.INTEGER,
    },
    duree: {
      type: Sequelize.INTEGER,
    },
    etat: {
      type: Sequelize.INTEGER,
    },
  })

  return Abonnement
}
