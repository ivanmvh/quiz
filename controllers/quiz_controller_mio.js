var models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req,res) 
{
	models.Quiz.findAll().success(function(quiz)
	{
   	 res.render('quizes/question',{pregunta: quiz[0].pregunta});
	})
};

// GET /quizes/answer
exports.answer = function(req,res) 
{
	 console.log("req.query.respuesta ==="+req.query.respuesta );
	 console.log("req.hostname ==="+req.hostname );
	 console.log("req.query ==="+JSON.stringify(req.query, null, 4) );
	 console.log("req.body ==="+JSON.stringify(req.body, null, 4) );
	 models.Quiz.findAll().success(function(quiz)
	 {
	 if (req.query.respuesta === quiz[0].respuesta)
	 {
	 	res.render('quizes/answer', {respuesta: "< " + req.query.respuesta + '> es una respuesta Correcta !! Hurra !!'});
	 } else {
	 	res.render('quizes/answer', {respuesta: "< " + req.query.respuesta + ' > es una respuesta Incorrecta...Baahh'});
	 }
	})	 
};

// GET /autor
exports.autor = function(req,res) {
	 res.render('autor');
};