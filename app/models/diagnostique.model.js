module.exports = (sequelize, Sequelize) => {
  const Diagnostique = sequelize.define('diagnostiques', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    observation: {
      type: Sequelize.STRING,
    },
    date: {
      type: Sequelize.STRING,
    },
  })

  return Diagnostique
}
