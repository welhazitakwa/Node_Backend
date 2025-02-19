module.exports = (sequelize, Sequelize) => {
  const Ordonnance = sequelize.define('ordonnances', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    description: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.STRING,
    },
    idConsltO: {
      type: Sequelize.INTEGER,
    },
  })

  return Ordonnance
}
