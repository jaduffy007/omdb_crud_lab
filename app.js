var express = require('express'),
    request = require('request'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// Variables for add to Watchlist
var myFilms = [];

//Beginning
app.get('/', function(req, res){
  res.render('index.ejs');
});

//Search
app.get('/search', function(req, res){

  //Grab the movie title from the URL query string
  var searchTerm = req.query.movieTitle;

  //Build the URL that we're going to call
  var url = "http://www.omdbapi.com/?s=" + searchTerm;

  // Call the OMBD API searching for the movie
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      res.render("results", {movieList: obj.Search});
    }
  });
});

//Movie Details
app.get('/results/:id', function(req,res){
   var filmId = req.params.id;
   var obj;
  //Build the URL that we're going to call
  var url = "http://www.omdbapi.com/?i=" + filmId;

  // Call the OMBD API searching for the movie
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      obj = JSON.parse(body);
      res.render("show", {film: obj});
    }
  });
});

//Add to Watchlist
app.post('/later', function(req,res){
  var filmId = req.params.id;
  var obj = {};
  obj.title = req.body.film.title;
  myFilms.push(obj);
  // //Build the URL that we're going to call
  // var url = "http://www.omdbapi.com/?i=" + filmId;
  // // Call the OMBD API searching for the movie
  // request(url, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     obj = JSON.parse(body);
  //     console.log(obj);
  //     myFilms.push(obj);
      res.redirect("later", {allMyFilms: myFilms});
    });

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});