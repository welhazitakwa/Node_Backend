module.exports = (sequelize, Sequelize) => {
  const Borderau = sequelize.define('borderaux', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    intitule: {
      type: Sequelize.STRING,
    },
    etat: {
      type: Sequelize.STRING,
    },
    reference: {
      type: Sequelize.STRING,
    },
    idMedBord: {
      type: Sequelize.INTEGER,
    },
  })

  return Borderau
}
