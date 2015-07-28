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
  { console.log("--->>>  quiz_controller index 5");
    //console.log("--->>>  req.query.search.length ="+ req.query.search.length);
    console.log("--->>>  req.query.search ="+ req.query.search);
    // var wtemp=req.query.search.trim();

    var wtemp=req.query.search || ' ';
    console.log("--->>> wtemp===null --->>> "+ wtemp===null) ;
    var wtrim = (" " + wtemp).trim();
    var wlen = wtrim.length;

    if (wlen  > 0 )
      { console.log("--->>>  si hay req.query.search ="+ wtrim);
        models.Quiz.findAll({where: ["pregunta  ilike ?", ('%'+wtrim+'%').replace(/\s+/g,'%')]}).then
        (function(quizes) 
          {res.render('quizes/index.ejs', { quizes: quizes});}
        ).catch(function(error) {next(error);})
      }
    else
      { console.log("--->>>  no hay req.query.search ="+ req.query.search);
        models.Quiz.findAll().then
        (function(quizes) 
        {res.render('quizes/index.ejs', { quizes: quizes});}
        ).catch(function(error) {next(error);})
      };    
  };

// GET /quizes/:id
// @im - muestra datos de registro solicitado por id y espera respuesta
exports.show = function(req, res) 
  {res.render('quizes/show', { quiz: req.quiz});};

// GET /quizes/:id/answer
// @im - procesa respuesta 
exports.answer = function(req, res) 
  { console.log( "--->>> req.query.respuesta = req.quiz.respuesta" + 
                 req.query.respuesta.toUpperCase() + "=" + req.quiz.respuesta.toUpperCase());
    
    var resultado = 'Incorrecta';
    var resultado = '< ' + req.query.respuesta + ' > es una respuesta Incorrecta...Baahh'

    if  ((req.query.respuesta).toUpperCase().trim() === (req.quiz.respuesta).toUpperCase().trim()) 
        {resultado= "< " + req.query.respuesta + '> es una respuesta Correcta !! Hurra !!'; }
    
    res.render('quizes/answer', { quiz : req.quiz ,respuesta: resultado });
  };

// GET /quizes/new
// @im - Pide datos Registro Nuevo

exports.new = function(req, res) 
{
  var quiz = models.Quiz.build
  ({pregunta: "Pregunta", respuesta: "Respuesta"});

  res.render('quizes/new', { quiz: quiz});
};

// POST /quizes/create
// @im - Crea Registro Nuevo en Basede Datos

exports.create = function(req, res) 
  {
    var quiz = models.Quiz.build (req.body.quiz);

    // guarda en BD los campos pregunta y respuesta de quiz
    quiz.save({fields: ["pregunta", "respuesta"]}).then(function()
        {res.redirect('/quizes');})
  }; 

// GET /autor
// @im - despliegue informacion estatica
exports.autor = function(req,res) {
   res.render('autor');
};