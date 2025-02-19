module.exports = (sequelize, Sequelize) => {
  const Operation = sequelize.define('operations', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: Sequelize.STRING,
    },
    lieu: {
      type: Sequelize.STRING,
    },
    resultat: {
      type: Sequelize.INTEGER,
    },
    etat: {
      type: Sequelize.INTEGER,
    },
    date: {
      type: Sequelize.STRING,
    },
    temps: {
      type: Sequelize.STRING,
    },
    raisons: {
      type: Sequelize.STRING,
    },
    idConslt: {
      type: Sequelize.INTEGER,
    },
    remarqueRS: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  })

  return Operation
}
