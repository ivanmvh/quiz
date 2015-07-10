// GET /quizes/question
exports.question = function(req,res) {
	 res.render('quizes/question',{pregunta: 'Capital de Italia'});
};

// GET /quizes/answer
exports.answer = function(req,res) {
	 console.log("req.query.respuesta ==="+req.query.respuesta );
	 console.log("req.hostname ==="+req.hostname );
	 console.log("req.query ==="+JSON.stringify(req.query, null, 4) );
	 console.log("req.body ==="+JSON.stringify(req.body, null, 4) );

	 if (req.query.respuesta === 'Roma'){
	 	res.render('quizes/answer', {respuesta: "< " + req.query.respuesta + '> es una respuesta Correcta !! Hurra !!'});
	 } else {
	 	res.render('quizes/answer', {respuesta: "< " + req.query.respuesta + ' > es una respuesta Incorrecta...Baahh'});
	 }
};