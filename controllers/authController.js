const passport = require('passport');
const Usuarios = require('../Models/Usuarios');
const bcrypt = require('bcrypt-nodejs');
const Sequelize =  require('sequelize');
const Op = Sequelize.Op;
const enviarEmail = require('../handlers/email');

const crypto = require('crypto');

exports.autenticarUsuario = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: true,
  badRequestMessage: 'Ambos campos son obligatorios'
});

// revisar su el usuario esta logeado o no
exports.usuarioAutenticado = (req, res, next) => {
  // Si es usuario autenticado, adelante!
  if(req.isAuthenticated()) {
    return next();
  }

  // Sino esta autenticado, rederigir al formularion de inicio de sesion
  return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion')
  });
}

// Genera un token si el usuario es valido
exports.enviarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({where: {email: req.body.email}});

  // Si no exite el usuario
  if(!usuario) {
    req.flash('error', 'No existe esa cuenta')
    // AMBAS MANERAS HACEN LO MISMO
    // res.render('reestablecer', {
    //   nombrePagina: 'Reestablecer tu Password',
    //   mensajes: req.flash()
    // });
    res.redirect('/reestablecer');
  }

  // Si el usuario existe
  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;

  // guardar en la base de datos
  await usuario.save();

  // url de reset
  const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

  //Enviar el correo con el token
  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'reestablecer-password'
  });

  // terminar accion
  req.flash('correcto', 'Se envio un mensaje a tu correo');
  res.redirect('/inciar-sesion');
}

exports.validarToken = async (req, res) => {
  // res.json(req.params.token);
  const usuario = await Usuarios.findOne({where: {token: req.params.token}});

  // Si no se encuentra el usuario
  if(!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }

  // formularo para generar el password
  res.render('resetPassword', {
    nombrePagina: 'Reestablecer Password'
  });
}

// Cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
  // Verificar que el token sea valido y tambien la expiracion
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        [Op.gte] : Date.now()
      }
    }
  });

  // Verificar si el usuario existe
  if(!usuario) {
    req.flash('error', 'No valido');
    res.redirect('/reestablecer');
  }

  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;

  // guardar el nuevo password
  await usuario.save();

  req.flash('correcto', 'Tu password se a modificado correctamente!');
  res.redirect('/iniciar-sesion');
}