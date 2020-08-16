const express = require('express');
const router = express.Router();
// importar express validator
const {body} = require('express-validator');

// importar el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
  // Ruta para el home
  router.get('/', 
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );
  // Ruta para el formulario
  router.get('/nuevo-proyecto',
    authController.usuarioAutenticado,
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );
  // Ruta para mandar los datos del formulario
  router.post('/nuevo-proyecto',
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );
  // Listar los proyectos
  router.get('/proyectos/:url', 
    authController.usuarioAutenticado,
    proyectosController.proyecPorUrl
  );
  // Actualizar proyectos
  router.get('/proyecto/editar/:id', 
    authController.usuarioAutenticado,
    proyectosController.formularioEditar
  );
  router.post('/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );
  // Eliminar proyecto
  router.delete('/proyectos/:url', 
    authController.usuarioAutenticado,  
    proyectosController.eliminarProyecto
  );

  // Tareas

  // Agregar una tarea
  router.post('/proyectos/:url', 
    authController.usuarioAutenticado,  
    tareasController.agregarTarea
  );
  // Actuaizar Tarea
  router.patch('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.cambiarEstadoTarea
  );
  // Eliminar tarea
  router.delete('/tareas/:id', 
    authController.usuarioAutenticado,
    tareasController.eliminarTarea
  );

  // Cunetas

  // Crear una cuenta nueva
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearCuenta);
  router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

  //Iniciar sesion
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  // Cerrar sesion
  router.get('/cerrar-sesion', authController.cerrarSesion);

  // Reestablecer password
  router.get('/reestablecer', usuariosController.formReestablecerPassword);
  router.post('/reestablecer', authController.enviarToken);
  router.get('/reestablecer/:token', authController.validarToken);
  router.post('/reestablecer/:token', authController.actualizarPassword);
  return router;
}