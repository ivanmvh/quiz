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
exports.show = function(req, res) 
  {res.render('quizes/show', { quiz: req.quiz});};

// GET /quizes/:id/answer
exports.answer = function(req, res) 
  { console.log( "--->>> req.query.respuesta = req.quiz.respuesta" + 
                 req.query.respuesta.toUpperCase() + "=" + req.quiz.respuesta.toUpperCase());
    
    var resultado = 'Incorrecta';
    
    if  ((req.query.respuesta).toUpperCase().trim() === (req.quiz.respuesta).toUpperCase().trim()) 
        {resultado= 'Correcto'; }
    
    res.render('quizes/answer', { quiz : req.quiz ,respuesta: resultado });
  };

// GET /autor
exports.autor = function(req,res) {
   res.render('autor');
};