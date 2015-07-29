var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
/* Página de Entrada  (home page) */
router.get('/', function(req, res) {
  res.render('index', { title: 'QUIZ' , errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);

// Definicion de rutas de /quizes
// Pagina de Inicio, Menu de Inicio
router.get('/quizes'              		   , quizController.index); 

router.get('/quizes/:quizId(\\d+)'         , quizController.show); 
router.get('/quizes/:quizId(\\d+)/answer'  , quizController.answer);

// Creacion de Nuevo 
router.get('/quizes/new'              	   , quizController.new); 
router.post('/quizes/create'       		   , quizController.create); 

// Actualizacion Update
router.get('/quizes/:quizId(\\d+)/edit'    , quizController.edit); 
router.put('/quizes/:quizId(\\d+)'         , quizController.update); 

// Pagina de Creditos / Autor
router.get('/autor'               		   , quizController.autor);

module.exports = router;
