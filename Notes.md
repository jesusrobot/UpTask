# Notes 

--save : guarda las dependencias del Proyecto
--save-dev: las guarda pero cuando se sube a prodccion se eliminan. solo  se usan en el desarrollo del proyecto

req : son nuestras peticiones al servidor, por ejemplo mandar los datos de un formulario
res : son las respuestas (contenido) que nos devuelve el servidor, por ejemplo que nos muestre la pagina de inicio de nuestroa web

app.use() : lee todos los verbos de http

res.send() : sirve para mandar contenido como strings 
res.json() : mandar data formateada a json
res.render() : mandar interfaces web html


para crear las rutas en el modelo mvc usamos un concepto llamado separacion
de resonsabilidades que nos dice que hay que separar las diferentes funcionalidades
por carpeta, para tener una estructura mucho mas facil de mantener en nuestro proyecto


# MVC
 EL MODELO- VISTA - CONTROLADOR ES: un patron de diseno de software que permite la separacion de 
 obligacones de cada pieza de codigo. Enfatiza en la separacion de la logica de programacion y lo que se muestra en pantalla

MODEL - VIEW - CONTROLLER

MODEL: ENCARGADO DE LOS DATOS (DESDE UNA DB) Y DE LA LOGICA PARA MOSTRAR ESTOS DATOS.

VIEW: SE ENCARGA DE TODO LO QUE SE VE EN PANTALLA 

CONTROLLER: ES LO QUE SE COMUNICA ENTRE EL VIEW Y EL MODELO.

ROUTER: REGISTRA LAS URLS O ENDPOINTS QUE LA APP SOPORTA.

# exports

export default === module.exports (export por default solo uno)
export === exports (varios exports)

# template engines 

* en el MVC un template engine es la "V" (vista) permite mostrar los datos en pantalla con html/css
* hay muchos template engines bro
* puedes usar javascript dentro de html :0
  * pug
  * enbedded js
  * handle bars
* se instala desde npm
* con todos los template engines se puede lograr lo mismo

* path es una libreria para ver los archivos de nuestro filesystem



