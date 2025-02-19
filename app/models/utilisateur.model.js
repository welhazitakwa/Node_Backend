module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('utilisateurs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UI: {
      type: Sequelize.STRING,
      unique: true,
    },
    cin: {
      type: Sequelize.INTEGER,
    },
    nom: {
      type: Sequelize.STRING,
    },
    prenom: {
      type: Sequelize.STRING,
    },
    tel: {
      type: Sequelize.INTEGER,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    adresse: {
      type: Sequelize.STRING,
    },
    dateNaissance: {
      type: Sequelize.STRING,
    },
    login: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    profil: {
      type: Sequelize.INTEGER,
    },
    permissions: {
      type: Sequelize.INTEGER,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    date_ins: {
      type: Sequelize.STRING,
    },
    etat: {
      type: Sequelize.INTEGER,
    },
    gouvernorat: {
      type: Sequelize.STRING,
    },
    cpostal: {
      type: Sequelize.STRING,
    },
    genre: {
      type: Sequelize.STRING,
    },
  })
 
  return User
}
