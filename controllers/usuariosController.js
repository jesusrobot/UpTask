const Usuarios = require('../Models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear cuenta en UpTask'
  });
}

exports.crearCuenta = async (req, res) => {
  // Leer los datos
  const {email, password} = req.body;

  try {
    await Usuarios.create({email, password});

    // Crear el url de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    // Crer el objeto de usuario
    const usuario = {
      email
    }
    // Enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirmar tu cuenta de UpTask',
      confirmarUrl,
      archivo: 'confirmar-cuenta'
    });

    // Redirigir usuario
    req.flash('correcto', 'Enviamos un correo para confirmar tu cuenta')
    res.redirect('/iniciar-sesion/');

  } catch (error) {
    req.flash('error', error.errors.map(error => error.message))
    res.render('crearCuenta', {
      mensajes: req.flash(),
      nombrePagina: 'Crear cuanta en UpTasks',
      email,
      password
    })
  }
}

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo
    }
  });

  // Si el usuario no existe
  if(!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/crear-cuenta');
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada correctamente');
  res.redirect('/iniciar-sesion');
}

exports.formIniciarSesion= (req, res) => {
  const {error} = res.locals.mensajes;
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar sesion en UpTask',
    error
  });
}

exports.formReestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer tu Password'
  })
}