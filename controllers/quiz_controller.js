var models = require('../models/models.js');


// Autoload - factoriza el código si la ruta incluye :quizId
// @im - busqueda por id generica y anticipada ?
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
// @im - lista filtrada o total
exports.index = function(req, res) 
  { var wtemp=req.query.search || ' ';
    var wtrim = (" " + wtemp).trim();
    var wlen = wtrim.length;

    if (wlen  > 0 )
      { console.log("--->>>  si hay req.query.search ="+ wtrim);
        models.Quiz.findAll({where: ["pregunta  ilike ?", ('%'+wtrim+'%').replace(/\s+/g,'%')]}).then
        (function(quizes) 
          {res.render('quizes/index.ejs', { quizes: quizes, errors: []});}
        ).catch(function(error) {next(error);})
      }
    else
      { console.log("--->>>  no hay req.query.search ="+ req.query.search);
        models.Quiz.findAll().then
        (function(quizes) 
        {res.render('quizes/index.ejs', { quizes: quizes, errors: []});}
        ).catch(function(error) {next(error);})
      };    
  };

// GET /quizes/:id
// @im - muestra datos de registro solicitado por id y espera respuesta
exports.show = function(req, res) 
  {res.render('quizes/show', { quiz: req.quiz , errors: []});};

// GET /quizes/:id/answer
// @im - procesa respuesta 
exports.answer = function(req, res) 
  { console.log( "--->>> req.query.respuesta = req.quiz.respuesta" + 
                 req.query.respuesta.toUpperCase() + "=" + req.quiz.respuesta.toUpperCase());
    
    var resultado = 'Incorrecta';
    var resultado = '< ' + req.query.respuesta + ' > es una respuesta Incorrecta...Baahh'

    if  ((req.query.respuesta).toUpperCase().trim() === (req.quiz.respuesta).toUpperCase().trim()) 
        {resultado= "< " + req.query.respuesta + '> es una respuesta Correcta !! Hurra !!'; }
    
    res.render('quizes/answer', { quiz : req.quiz ,respuesta: resultado , errors: [] });
  };

// GET /quizes/new
// @im - Pide datos Registro Nuevo

exports.new = function(req, res) 
{
  var quiz = models.Quiz.build
  ({pregunta: "Pregunta", respuesta: "Respuesta", tema: " "});

  res.render('quizes/new', { quiz: quiz , errors: []});
};

// POST /quizes/create
// @im - Crea Registro Nuevo en Basede Datos

exports.create = function(req, res) 
  {
    var quiz = models.Quiz.build (req.body.quiz);

    quiz.validate()
      .then (
        function(err){
          if (err) {
            res.render('quizes/new', {quiz: quiz, errors: err.errors});  
          } else {
              // guarda en BD los campos pregunta y respuesta de quiz
              quiz.save({fields: ["pregunta", "respuesta","tema"]}).then(function()
              {res.redirect('/quizes')})
          }
        }   
      );
  }; 

// Modificacion, Edicion - Muestra Registro a Editar GET quizes/:id/edit
// El Autoload se encarga de accesar antes el registo a modificar
exports.edit = function(req, res) 
  { var quiz = req.quiz; // el req.quiz lo crea el autoload
    res.render('quizes/edit', {quiz:quiz, errors: []});
  };  

// PUT /quizes/:id - Update - Actualizar
exports.update = function(req, res) 
  {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    req.quiz.validate()
      .then (
        function(err){
          if (err) {
            res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});  
          } else {
              // guarda en BD los campos pregunta y respuesta de quiz
              req.quiz.save({fields: ["pregunta", "respuesta","tema"]}).then(function()
              {res.redirect('/quizes')})
          }
        }   
      );
  }; 


// DELETE /quizes/:id   - borrar registro de la BD
exports.destroy = function(req, res) 
  {req.quiz.destroy()
      .then (function(){res.redirect('/quizes');})
      .catch(function(error) {next(error);});
   };   

// GET /autor
// @im - despliegue informacion estatica
exports.autor = function(req,res) {
   res.render('autor');
};