var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req,res,next,quizId)
{models.Quiz.findById(quizId).then 
  (function(quiz)
    {
      if (quiz) 
      {
        req.quiz=quiz;
        next();
      } else {next (new Error('No existe quizId='+quizId));}
    }
  ).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function(req, res) 
  {console.log("quiz_controller index 5");
   models.Quiz.findAll().then
      (function(quizes) 
        {res.render('quizes/index.ejs', { quizes: quizes});}
      ).catch(function(error) {next(error);})
  };

// GET /quizes/:id
exports.show = function(req, res) 
  {res.render('quizes/show', { quiz: req.quiz});};

// GET /quizes/:id/answer
exports.answer = function(req, res) 
  { console.log("req.query.respuesta = req.quiz.respuesta" + req.query.respuesta + "="+req.quiz.respuesta);
    var resultado = 'Incorrecta';
    if  (req.query.respuesta === req.quiz.respuesta) 
        {resultado= 'Correcto'; }
    res.render('quizes/answer', { quiz : req.quiz ,respuesta: resultado });
  };

// GET /autor
exports.autor = function(req,res) {
   res.render('autor');
};