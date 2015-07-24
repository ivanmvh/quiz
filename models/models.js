var path = require('path');

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

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);
console.log("____>>> 36")
// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);
console.log("____>>> 40")
exports.Quiz = Quiz; // exportar definición de tabla Quiz
console.log("____>>> 42")
// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // success(..) ejecuta el manejador una vez creada la tabla
  console.log("____>>> 46");
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      console.log("--->>> Base Vacia se llena");
      Quiz.bulkCreate( 
        [ {pregunta: 'Capital de Italia',   respuesta: 'Roma'},
          {pregunta: 'Capital de Portugal', respuesta: 'Lisboa'},
          {pregunta: 'Capital de Colombia', respuesta: 'Bogota'},
          {pregunta: 'Capital de Venezuela', respuesta: 'Caracas'}
        ])    
      .then(Quiz.count().then (function(count){
          console.log('--->> Base de datos inicializada con '+count +" registros.");
          console.log('--->>'+ Quiz)
        }));
    } else {console.log('--->> Base de datos ya tiene Registros--> ' + count);
            console.log('--->>'+ Quiz)
    };
  });
});
console.log("____>>> 57 fin models.js")