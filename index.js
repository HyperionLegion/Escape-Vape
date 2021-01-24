// AT THE TOP OF YOUR FILE
var express = require('express');
var path = require('path');
var app = express();
var cons = require('consolidate');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config/database')
var passport = require('passport');
const server = require("http").Server(app);
const io = require("socket.io")(server);
var nodemailer = require('nodemailer');

mongoose.connect(process.env.MONGODB_URI || config.database, {
	useNewUrlParser: true,
	useUnifiedTopology:true
});
let db = mongoose.connection;

//check db connection
db.once('open', function(){
	console.log('Connected to MongoDB')
})

//check db errors
db.on('error', function(err){
	console.log(err)
})
//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//view engine setup
//app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');
app.set('view engine', 'ejs');

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
	res.locals.user=req.user || undefined;
	next();
});

app.set( 'port' , process.env.PORT || 8080 ) ;

//routes
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'escapevapeapp@gmail.com',
    pass: 'EscapeVape2020!'
  }
});

let Email = require('./models/email');
var schedule = require('node-schedule');

var j = schedule.scheduleJob('0 0 * * *', function(){
   Email.find({}, function(err, result){
      if(err){
        console.log(err);
      }
      else{
        result.forEach(mail => {
          var mailOptions = {
  from: 'escapevapeapp@gmail.com',
  to: mail.email,
  subject: 'Escape Vape Motivation!',
  text: 'The grind does not stop!'
};
   transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
        })
      }
  });
  console.log('running a task every day');
});

app.get('/', function(req, res){

  res.render('index')
});
/*app.get('/:page', function(req, res){

    var info = {
        page : req.params.page
    };

    res.send("Not valid URL for this site")
});*/
app.get('/lifeline', ensureAuthenticated, function(req, res){
  res.render('lifeline');
});
let users = require('./routes/users');
app.use('/users', users);
let rooms = require('./routes/rooms');
app.use('/rooms', rooms);
let therapies = require('./routes/therapies');
app.use('/therapy', therapies);



//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  req.flash('danger', 'Not a valid URL');
  res.status(404).redirect('/');
});
//port
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}
 var listener = app . listen( app.get( 'port' )  , function() {   

    console . log( "Express server started on port: " + listener . address() . port ) ;

 } ) ;
