var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var session = require('express-session');
var io = require('socket.io')(http);

var users = [];

var x = "";
var peopel={};
app.set('view engine', 'ejs');


app.use(bodyParser());
app.use(session({secret : 'tss'}));

app.get('/', function(req, res){
	res.render(__dirname+"/index.ejs");
});
app.post("/", function(req, res){
	// console.log(req.body);
	// req.session.name=req.body.name;
	x=req.body.name;
	users.push(req.body.name);
	res.redirect('/onlineuser');
});

io.on('connection', function(socket){
	peopel[x]=socket.id;
	console.log(peopel);
	io.emit('online', users);
	socket.on("message", function(data){
		// console.log(data);
		io.to(peopel[data.name]).emit('chat', {name : data.name, msg : data.msg});
		// perticular socket id
	});
});
app.get('/onlineuser', function(req, res){
	res.render(__dirname+"/onlineuser.ejs");
});

app.get('/chat/:name', function(req, res){
	console.log(req.params.name);
	res.render(__dirname+"/chat.ejs");

});

http.listen(3000, function(){
	console.log('Running');
});