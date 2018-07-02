var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use('/static', express.static(__dirname+ '/resources'));

var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb'}));
app.use(cookieParser());

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/chat', (req, res) => {
	res.sendFile(__dirname + '/chat.html');
});

authRoutes = require('./routes/authRoutes')();
app.use('/auth', authRoutes);

contactRoutes = require('./routes/contactRoutes')();
app.use('/contact', contactRoutes);


http.listen(port, function(){
    console.log('Handshake dev running on port: ' + port);
});
