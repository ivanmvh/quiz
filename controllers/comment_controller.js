var models = require('../models/models.js');




// GET /quizes/new
// @im - Pide datos Registro Nuevo

exports.new = function(req, res) 
{res.render('comments/new', { quizid: req.params.quizId , errors: []});};

// POST /quizes/:quizId/comments - create
// @im - Crea Registro Nuevo en Base de Datos

exports.create = function(req, res) 
  {
    var comment = models.Comment.build (
    { texto: req.body.comment.texto,
      QuizId: req.params.quizId });

    comment.validate()
      .then (
        function(err){
          if (err) {
            res.render('comments/new', {comment: comment, quizid: req.params.quizId,  errors: err.errors});  
          } else {
              // guarda en BD los campos texto de comment
              comment.save().then(function()
              {res.redirect('/quizes/'+req.params.quizId)})
          }
        }   
      ).catch(function(error) {next(error);});
  }; 