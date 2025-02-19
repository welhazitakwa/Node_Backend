module.exports = (sequelize, Sequelize) => {
  const Facture = sequelize.define('factures', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    montant: {
      type: Sequelize.FLOAT,
    },
    etat: {
      type: Sequelize.STRING,
    },
    TVA: {
      type: Sequelize.FLOAT,
    },
    IUPaBord: {
      type: Sequelize.STRING,
    },
    idBord: {
      type: Sequelize.INTEGER,
    },
    ref: {
      type: Sequelize.STRING,
    },
  }) 

  return Facture
}
