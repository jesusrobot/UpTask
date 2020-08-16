const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../Models/Usuarios');

// Local strategy - Login con credenciales propios (usuario y password)
passport.use(
  new LocalStrategy(
    // Por default passport espera user y password
    {
      usernameField: 'email',
      passwordField: 'password'
    }, 
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: {
            email,
            activo: 1
          }
        });

        if(!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: 'Password incorrecto'
          });
        }
        // El email y el password es correcto
        return done(null, usuario);

      } catch (error) {
        // si el usuario no existe...
        return done(null, false, {
          message: 'Esa cuenta no existe'
        })
      }
    }
  )
);

// Serealizar el usuario 
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});
// Deserealizar el objeto
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;