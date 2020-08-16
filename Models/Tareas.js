const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyecto = require('./Proyecto')

const Tareas = db.define('tareas', {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  tarea: Sequelize.STRING(100),
  estado: Sequelize.INTEGER(1)

});

Tareas.belongsTo(Proyecto);
// Proyecto.hasMany(Tareas)  esto va desde el modelo del proyecto

module.exports =  Tareas;