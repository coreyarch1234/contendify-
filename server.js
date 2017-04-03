//Express Set
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var httpServer = http.createServer(app);
var io = require('socket.io')(httpServer);

//Allows you to use req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
// getting-started.js Mongoose
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/contendify');

//Jwt and cookies
var jwt = require('express-jwt');
var cookieParser = require('cookie-parser');
app.use(cookieParser());


//Home Route
app.get('/', function(req, res){
    res.render('home');
});

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


//DEPLOY
httpServer.listen(process.env.PORT || 3000, function() {

});

module.exports = httpServer;
