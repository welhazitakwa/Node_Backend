module.exports = (sequelize, Sequelize) => {
  const Specialite = sequelize.define('specialites', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  })

  return Specialite
}
