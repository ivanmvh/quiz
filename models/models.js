var path = require('path');
// @im - obtiene parametros de base de datos a usar de archivo .env
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
console.log(process.env.DATABASE_URL);
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

console.log('--->>  --- VALORES BASE DATOS ---- models ---- ' );
console.log('--->> DB_name->'+DB_name  ); 
console.log('--->> user->'+user     ); 
console.log('--->> pwd->'+pwd      );
console.log('--->> protocol->'+protocol ); 
console.log('--->> dialect->'+dialect  ); 
console.log('--->> port->'+port     ); 
console.log('--->> host->'+host     ); 
console.log('--->> storage->' + storage     ); 
// Cargar Modelo ORM
var Sequelize = require('sequelize');

// @im - Se accesara mediante el ORM Sequalize
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true,      // solo Postgres
    dialectOptions: {
        ssl: (host === 'localhost') ? false : true // @im - lo puse a ver si arranca bien foreman co base pg en heroku (àrece que no arreglo problema)
    }
  }      
);
console.log("____>>> 36")

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);
console.log("____>>> 40")

var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);
console.log("____>>> 41")

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar definición de tabla Quiz
console.log("____>>> 42")

exports.Comment = Comment; // exportar definición de tabla Comment
console.log("____>>> 43")

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(
  function() {
    // success(..) ejecuta el manejador una vez creada la tabla
    console.log("____>>> 46");
    Quiz.count().then(
      function (count){
        if(count === 0) {   // la tabla se inicializa solo si está vacía
          console.log("--->>> Base Vacia se llena");
          var iddb=process.env.DATABASE_URL.substring(0, 20);
          Quiz.bulkCreate( 
            [ {pregunta: 'Capital de Italia '+ iddb,   respuesta: 'Roma'},
              {pregunta: 'Capital de Portugal', respuesta: 'Lisboa'},
              {pregunta: 'Capital de Colombia', respuesta: 'Bogota'},
              {pregunta: 'Capital de Venezuela', respuesta: 'Caracas'},
              {pregunta: 'Capital de Peru', respuesta: 'Lima'}
            ]
          ).then(
              Quiz.count().then (
                function(count){
                  console.log('--->> Base de datos Quiz inicializada con '+count +" registros.")
                }
              )
            );
        } else {
            console.log('--->> Base de datos Quiz ya tiene Registros--> ' + count)
          };
      }
    );
  }
);
console.log("____>>> 57 fin models.js")