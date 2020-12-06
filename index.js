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
app.get('/', function(req, res){
  res.render('index')
});
/*app.get('/:page', function(req, res){

    var info = {
        page : req.params.page
    };

    res.send("Not valid URL for this site")
});*/

let users = require('./routes/users');
app.use('/users', users);
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  req.flash('danger', 'Not a valid URL');
  res.status(404).redirect('/');
});
//port
var listener = app . listen( app.get( 'port' )  , function() {   

   console . log( "Express server started on port: " + listener . address() . port ) ;

} ) ;
