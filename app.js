// Proyecto desarrollado en curso de Miriadax por Ivan Martinez
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz-ivanmvh'));
app.use(methodOverride('_method'));
app.use(session());
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next) {

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
    console.log("--->>> req.session.redir: "+req.session.redir);
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Autologout
app.use( function(req, res, next) {
  var ahora = new Date().getTime();                           
  req.session.timeOutSeg = 60 ;
  if ( req.session.ultimaTransaccion && req.session.user) {   
      // 1000 es un seg              
      if ((ahora-req.session.ultimaTransaccion)> req.session.timeOutSeg*1000){
          delete req.session.user;
          res.redirect("/login");
      }
  }
  req.session.ultimaTransaccion = ahora;
  res.locals.session = req.session;
  next();
});



app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});

module.exports = app;
