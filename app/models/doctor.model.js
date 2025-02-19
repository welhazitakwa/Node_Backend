module.exports = (sequelize, Sequelize) => {
  const Doctor = sequelize.define('doctors', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    MF: {
      type: Sequelize.STRING,
    },
    RC: {
      type: Sequelize.STRING,
    },
    cabinet: {
      type: Sequelize.STRING,
    },
    adressCabinet: {
      type: Sequelize.STRING,
    },
    hopital: {
      type: Sequelize.STRING,
    },

    from: {
      type: Sequelize.STRING,
    },
    to: {
      type: Sequelize.STRING,
    },
    design: {
      type: Sequelize.STRING,
    },
    award: {
      type: Sequelize.STRING,
    },
    yearAward: {
      type: Sequelize.STRING,
    },
    membership: {
      type: Sequelize.STRING,
    },
    registration: {
      type: Sequelize.STRING,
    },
    yearRegistration: {
      type: Sequelize.STRING,
    },
    cabAdress: {
      type: Sequelize.STRING,
    },
    cabTel: {
      type: Sequelize.STRING,
    },
    cabCity: {
      type: Sequelize.STRING,
    },
    cabState: {
      type: Sequelize.STRING,
    },
    cabCP: {
      type: Sequelize.STRING,
    },
    cabService: {
      type: Sequelize.STRING,
    },
    // cabSpecialite: {
    //   type: Sequelize.STRING,
    // },
    degree: {
      type: Sequelize.STRING,
    },
    institut: {
      type: Sequelize.STRING,
    },
    yearDegree: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },

    idspc: {
      type: Sequelize.INTEGER,
    },
    iduser: {
      type: Sequelize.INTEGER,
    },
    idabn_idx: {
      type: Sequelize.INTEGER,
    },
    note: {
      type: Sequelize.FLOAT,
    },
  })

  return Doctor
}
