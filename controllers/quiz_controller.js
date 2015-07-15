var models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().then(function(quiz) {
    res.render('quizes/question', { pregunta: quiz[0].pregunta});
  })
};

// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().then(function(quiz) {
    console.log("req.query.respuesta = quiz[0].respuesta" + req.query.respuesta + "="+quiz[0].respuesta);
    if (req.query.respuesta === quiz[0].respuesta) {
      res.render('quizes/answer', { respuesta: 'Correcto' });
    } else {
      res.render('quizes/answer', { respuesta: 'Incorrecto'});
    }
  })
};

// GET /autor
exports.autor = function(req,res) {
   res.render('autor');
};