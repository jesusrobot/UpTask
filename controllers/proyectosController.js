const Proyectos = require('../Models/Proyecto');
const Tareas = require('../Models/Tareas');

exports.proyectosHome = async (req, res) => {
  // console.log(res.locals.usuario);
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});

  res.render('index', {
    nombrePagina: 'Tus proyectos',
    proyectos
  });
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});
  
  res.render('nuevoProyecto', {
    nombrePagina: 'Crear un proyecto nuevo',
    proyectos
  });
}

exports.nuevoProyecto = async (req, res) => {
  // Enviar a la consola lo que el usuario escriba
  // console.log(req.body);
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({where: {usuarioId}});

  // Validar que tengamos algo en el input
  const {nombre} = req.body;
  let errores = [];

  if(!nombre) {
    errores.push({'texto': 'Agrea un nombre al proyecto'});
  }

  // Si hay errores...
  if(errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Crear un proyecto nuevo',
      errores,
      proyectos
    });
  } else {
    // Insertar en una base de datos si no hay errores
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre, usuarioId });
    await res.redirect(`/`);
  }
}

exports.proyecPorUrl = async (req, res, next) => {
  // res.send(req.params.url);
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId
    }
  });

  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

  // Consultar tareas del proyecto actual
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id
    }
    // ,
    // include: [
    //   {model: Proyectos}
    // ]
  });


  if(!proyecto) return next();

  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    proyecto,
    proyectos,
    tareas
  });
}

exports.formularioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});


  const proyectoPromise = Proyectos.findOne({
    where: {
      id: req.params.id,
      usuarioId
    }
  });

  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

  res.render('nuevoProyecto', {
    nombrePagina: 'Editar proyecto',
    proyectos,
    proyecto
  })
}

exports.actualizarProyecto = async (req, res) => {
  // Enviar a la consola lo que el usuario escriba
  // console.log(req.body);
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
  
  const proyectoPromise = Proyectos.findOne({where:{id: req.params.id}});
  
  const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);
  // Validar que tengamos algo en el input
  const {nombre} = req.body;

  let errores = [];

  if(!nombre) {
    errores.push({'texto': 'Agrea un nombre al proyecto'});
  }

  // Si hay errores...
  if(errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Crear un proyecto nuevo',
      errores,
      proyectos
    });
  } else {
    // Insertar en una base de datos si no hay errores
    await Proyectos.update(
      {nombre:nombre},
      {where: {id: req.params.id}}
    );
    res.redirect(`/proyectos/${proyecto.url}`);
  }
}

exports.eliminarProyecto = async (req, res, next) => {
  // console.log(req.query);
  const {urlProyecto} = req.query;
  
  const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

  if(!resultado) {
    return next();
  }

  res.send('Proyecto eliminado correctamente')
}