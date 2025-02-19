module.exports = (sequelize, Sequelize) => {
  const CadreMedical = sequelize.define('cadreMedical', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    mission: {
      type: Sequelize.STRING,
    },
    idCuser: {
      type: Sequelize.INTEGER,
      
    },
    idMed: {
      type: Sequelize.INTEGER,
      
    },
  })

  return CadreMedical
}
