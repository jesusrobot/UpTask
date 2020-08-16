const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Importar las variables de entorno
require('dotenv').config({path: 'variables.env'});

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexion a la base de datos
const db = require('./config/db');

// importar el modelo
require('./Models/Proyecto');
require('./Models/Tareas');
require('./Models/Usuarios');

db.sync()
  .then(() => console.log('Conenctado al servidor!'))
  .catch(error => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// habilitar el template engine
app.set('view engine', 'pug');

// Habilitar bodyParser para leer los datos del formulario
app.use(bodyParser.urlencoded({extended: true}));


// anadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Sesiones nos permiten navegar en distintas paginas sin volvernos a autenticar
app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar varDump a la aplicacion
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = {...req.user} || null;
  next();
});

// rooter
app.use('/', routes());

// habilitar el puerto que se va a escuchar
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log('EL SERVIDOR ESTA FUNCIONANDO!!!');
});
