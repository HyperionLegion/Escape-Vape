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

mongoose.connect('mongodb://localhost/escapevape');
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
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//express session middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));
app.use(expressValidator());



app.set( 'port' , process.env.PORT || 8080 ) ;

//routes
app.get('/', function(req, res){
  res.render('index')
});
app.get('/:page', function(req, res){

    var info = {
        page : req.params.page
    };

    res.send("Not valid URL for this site")
});

let users = require('./routes/users');
app.use('/users', users);

//port
var listener = app . listen( app.get( 'port' )  , function() {   

   console . log( "Express server started on port: " + listener . address() . port ) ;

} ) ;
