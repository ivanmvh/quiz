var models = require('../models/models.js');


// Autoload - factoriza el código si la ruta incluye :quizId
// @im - busqueda por id generica y anticipada ?
exports.load = function(req,res,next,quizId)
// {models.Quiz.findById(quizId){include: [{ models.Comment}]}.then 
   {models.Quiz.find({
            where: {id: Number(quizId)},
            include: [{model: models.Comment}],
            order:['Quiz.id',[models.Comment, 'publicado'],[models.Comment, 'texto']] 
        }).then
  (function(quiz)
    { console.log("4. JSON.stringify(quiz)-->> " + JSON.stringify(quiz) );
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
        models.Quiz.findAll({where: ["pregunta  ilike ?", ('%'+wtrim+'%').replace(/\s+/g,'%')], order: 'pregunta'}).then
        (function(quizes) 
          {res.render('quizes/index.ejs', { quizes: quizes, errors: []});}
        ).catch(function(error) {next(error);})
      }
    else
      { console.log("--->>>  no hay req.query.search ="+ req.query.search);
        models.Quiz.findAll({order: 'pregunta'}).then
        (function(quizes) 
        { console.log("4. JSON.stringify(quizes)-->> " + JSON.stringify(quizes) );
          res.render('quizes/index.ejs', { quizes: quizes, errors: []});}
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
   res.render('autor' ,{ errors: []});
};


// GET /estadisticas
exports.estadisticas = function(req, res){ 
  var kPreg=0;
  var kComen=0;
  var comXPreg=0;
  var kPregConCom=0;
  var kComPub=0;
  var kComPregPub=0;
  var kPregConComPub=0;

  models.Quiz.count().then( 
    function(kPreg) {
      console.log("2. Hay " + kPreg + " preguntas.");
      models.Comment.count().then( 
        function(kComen) {
          console.log("3. Hay " + kComen + " comentarios.");
          models.Quiz.findAll(
            {
              include: [{model: models.Comment , required: true}],
              order:['Quiz.id'],
              group:['Quiz.id','Comments.id']
            }
          ).then( 
            function(Preguntas) {
                console.log("4. JSON.stringify(Preguntas)-->> " + JSON.stringify(Preguntas) );
                kPregConCom=0;
                for (var i in Preguntas) {
                  console.log("id="+Preguntas[i].id);
                  kPregConCom=kPregConCom+1;
                  Comments=Preguntas[i].Comments;
                  kComPregPub=0;
                  for (var j in Comments) {
                      console.log("Comentarios.id="+Comments[j].id);
                      if (Comments[j].publicado) {kComPregPub=kComPregPub+1};
                  }
                  if (kComPregPub){ 
                     kComPub=kComPub+kComPregPub;
                     kPregConComPub=kPregConComPub+1;
                  }
                }
                console.log("2.2. Hay " + kPreg + " preguntas.");  
                console.log("3.2. Hay " + kComen + " comentarios.");  
                console.log("5.2. Hay " + kComen/kPreg + " comentarios por pregunta en Promedio.");
                console.log("6.2. Hay " + kPregConCom + " preguntas con comentarios.");
                console.log("7.2. Hay " + (kPreg - kPregConCom) + " preguntas sin comentarios.");  
                res.render('quizes/estadisticas.ejs', { kPreg:kPreg,  kComen:kComen, kPregConCom:kPregConCom, kComPub:kComPub,
                            kPregConComPub:kPregConComPub, errors: [] } )
            }
         )
        }
      )
    }
  )       
}; 