const Sequelize = require('sequelize').Sequelize;

const sequelize = new Sequelize('nodejs-course', 'root', '@Password123', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
