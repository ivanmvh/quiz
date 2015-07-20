var models = require('../models/models.js');

// GET /quizes
exports.index = function(req, res) {
  console.log("quiz_controller index 5");
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/index.ejs', { quizes: quizes});
  })
};

// GET /quizes/:id
exports.show = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', { quiz: quiz});
  })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  models.Quiz.findById(req.params.quizId).then(function(quiz) {
    console.log("req.query.respuesta = quiz.respuesta" + req.query.respuesta + "="+quiz.respuesta);
    if (req.query.respuesta === quiz.respuesta) {
      res.render('quizes/answer', { quiz : quiz ,respuesta: 'Correcta' });
    } else {
      res.render('quizes/answer', { quiz : quiz ,respuesta: 'Incorrecta'});
    }
  })
};

// GET /autor
exports.autor = function(req,res) {
   res.render('autor');
};