module.exports = {
  HOST: '192.168.10.10', //192.168.10.10
  USER: 'homestead',
  PASSWORD: 'secret',
  DB: 'homestead',
  dialect: 'mysql',
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
}
