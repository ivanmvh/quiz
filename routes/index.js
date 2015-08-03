var express = require('express');
var router = express.Router();
console.log("--->>> antes var commentController");
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
console.log("--->>> despues var commentController");
/* Página de Entrada  (home page) */
router.get('/', function(req, res) {
  res.render('index', { title: 'QUIZ' , errors: [] });
});
console.log("--->>> antes autoload");

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

// Definicion de rutas de /quizes
// Pagina de Inicio, Menu de Inicio
console.log("--->>> /quizes");
router.get('/quizes'              		   , quizController.index); 
console.log("--->>> /quizes/:quizId(\\d+)");
router.get('/quizes/:quizId(\\d+)'         , quizController.show); 
router.get('/quizes/:quizId(\\d+)/answer'  , quizController.answer);

// Creacion de Nuevo 
router.get('/quizes/new'              	   , quizController.new); 
router.post('/quizes/create'       		   , quizController.create); 

// Actualizacion Update
router.get('/quizes/:quizId(\\d+)/edit'    , quizController.edit); 
router.put('/quizes/:quizId(\\d+)'         , quizController.update); 

// Borrar Registro
router.delete('/quizes/:quizId(\\d+)'      , quizController.destroy); 

// -------------Comments ----------------------------------
// Nuevo Comment
router.get('/quizes/:quizId(\\d+)/comments/new'      , commentController.new); 
router.post('/quizes/:quizId(\\d+)/comments'         , commentController.create); 


// Pagina de Creditos / Autor
router.get('/autor'               		   , quizController.autor);

module.exports = router;
