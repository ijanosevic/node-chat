var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use('/static', express.static(__dirname+ '/client/resources'));

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/client/chat.html');
});

authRoutes = require('./routes/authRoutes')();
app.use('/auth', authRoutes);

http.listen(port, function(){
    console.log('App is runnning on port ' + port);
});

SocketServer = require('./server');
socketServer = new SocketServer(http);
socketServer.listen();