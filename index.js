// AT THE TOP OF YOUR FILE
var  https = require('https');

var express = require('express');
var path = require('path');
var app = express();

app.set( 'port' , 8080 ) ;



app.get('/', function(req, res){
  res.send("Index")
});
app.get('/:page', function(req, res){

    var info = {
        page : req.params.page
    };

    res.json(info)
});
var listener = app . listen( app.get( 'port' )  , function() {   

   console . log( "Express server started on port: " + listener . address() . port ) ;

} ) ;