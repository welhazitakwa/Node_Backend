module.exports = (sequelize, Sequelize) => {
  const Patient = sequelize.define('patients', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profession: {
      type: Sequelize.STRING,
    },

    poids: {
      type: Sequelize.INTEGER,
    },
    hauteur: {
      type: Sequelize.INTEGER,
    },
    typeSang: {
      type: Sequelize.STRING,
    },
    rythmeCardiaque: {
      type: Sequelize.STRING,
    },
    glycemie: {
      type: Sequelize.INTEGER,
    },
    allergies: {
      type: Sequelize.STRING,
    },
    maladiesCroniq: {
      type: Sequelize.STRING,
    },
    medicamentsCroniq: {
      type: Sequelize.STRING,
    },
    nomContctUrgnce: {
      type: Sequelize.STRING,
    },
    numContctUrgnce: {
      type: Sequelize.INTEGER,
    },
    lienParenteUrgnce: {
      type: Sequelize.STRING,
    },

    tension: {
      type: Sequelize.INTEGER,
    },
    iduserP: {
      type: Sequelize.INTEGER,
    },
    // IdentiteUniverselle: {
    //   type: Sequelize.INTEGER,
    // },
  })

  return Patient
}
