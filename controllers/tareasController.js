const Proyectos = require('../Models/Proyecto');
const Tareas = require('../Models/Tareas');

exports.agregarTarea = async (req, res, next) => {
  // console.log(req.params.url);

  // Obtener el proyecto actual
  const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

  // Leer el valor del input
  const {tarea} = req.body;

  // Estado y id del proyecto
  const estado = 0;
  const proyectoId = proyecto.id;
  console.log(proyectoId);

  // Insertar en la base de datos
  const resultado = await Tareas.create({tarea, estado, proyectoId});

  if(!resultado) {
    return next();
  }

  // Redireccionar
  res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea = async (req, res, next) => {
  const {id} = req.params;
  const tarea = await Tareas.findOne({where: {id}});

  let estado = 0;
  if(tarea.estado === estado) {
    estado = 1;
  }
  tarea.estado = estado;
  
  const resultado = await tarea.save();
  
  if(!resultado) return next();

  res.status(200).send('Todo bien...');
}

exports.eliminarTarea = async  (req, res, next) => {
  const {id} = req.params;
  const resultado = await Tareas.destroy({where: {id}});

  if(!resultado) return next();

  res.status(200).send('La tarea fue liminada con exito!');
}