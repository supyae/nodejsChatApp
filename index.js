var express = require('express');
var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

//setup the template engine
app.set('view engine', 'ejs'); // look for views folder automatically

//middlewares
app.use(express.static('public'));


app.get('/', function (req, res) {
  //res.sendFile(__dirname + '/index.html'); //when use html file, use : .sendFile();
  res.render('index'); //when use template engine : .render();
})

//check socket io connected or
// NOTE: Listen event
io.on('connection', function (socket) {
  //console.log('user connected');
  socket.on('chat message', function (msg) {
    //console.log('message: ' + msg);
    //when socket get the data, emit to rest of others
    io.emit('chat message', msg);
  });

   //// Chat App ////
   // NOTE: Default Username;
   // NOTE: socket represent each client connected to our server;
   socket.username = "Anonymous";
   // NOTE: Listen to change username;
   socket.on('change_username', function(data) {
     socket.username = data.username;
     console.log('socket username' + socket.username);
   });

   // NOTE: Listen on new message
   socket.on('new_message', function (data) {
     console.log(data);
     // NOTE: io.sockets = represents all the sockets connected
     io.sockets.emit('new_message',
       {message: data.message, username: socket.username}
     );
   });

   // NOTE: Listen typing
   socket.on('typing', function () {
     console.log('socket broadcast');
     socket.broadcast.emit('typing', {username: socket.username});
   });


});

http.listen(3000, function () {
  console.log('listening on port : 3000');
})
