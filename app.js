
// Express requires these dependencies
var routes = require('./routes')
var user = require('./routes/user')
var http = require('http')
var path = require('path');
var express = require('express');

var app = express();

// Configure our application
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Configure error handling
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Setup Routes
app.get('/', routes.index);
app.get('/users', user.list);

// Enable Socket.io
var server = http.createServer(app).listen( app.get('port') );
var io = require('socket.io').listen( server );
var active_connections = 0;

// A user connects to the server (opens a socket)
io.sockets.on('connection', function (socket) {

    // (2): The server recieves a ping event
    // from the browser on this socket
    socket.on('ping', function ( data ) {
  
        console.log('socket: server receives ping (2)');

        // (3): Emit a pong event all listening browsers
        // with the data from the ping event
        io.sockets.emit( 'pong', data );
    
        console.log('socket: server sends pong to all (3)');

    });

    active_connections++

    io.sockets.emit('user:connect', active_connections);

    socket.on("chat", function(message) {
        // Check that the client has already joined successfully,
        // and that the message isn't just an empty string,
        // then foward the message to all clients
        if (socket.nick && message) {
            io.sockets.emit("chat", {sender: socket.nick, message: message});
        }
    });


    /*
     Handle client disconnection
     --------------------------- */

    socket.on('disconnect', function () {
        //if the user disconnects from the server
        active_connections--
        io.sockets.emit('user:disconnect', active_connections);

    });

    // EVENT: User stops drawing something
    socket.on('draw:progress', function (uid, co_ordinates) {

        console.log('the coordinates : '+ co_ordinates + 'are drawn');
        io.sockets.emit('draw:progress', uid, co_ordinates)

    });

    socket.on('draw:progressL', function (uid, co_ordinates) {

        console.log('the coordinates : '+ co_ordinates + 'are drawn');
        io.sockets.emit('draw:progressL', uid, co_ordinates)

    });

    socket.on('draw:progresses', function (uid, co_ordinates) {

        console.log('the coordinates : '+ co_ordinates + 'are drawn');
        io.sockets.emit('draw:progresses', uid, co_ordinates)

    });

    // EVENT: User stops drawing something
    socket.on('draw:end', function (uid, co_ordinates) {
        console.log('the event point ends');
        io.sockets.emit('draw:end', uid, co_ordinates)

    });

    socket.on('draw:endL', function (uid, co_ordinates) {
        console.log('the event point ends');
        io.sockets.emit('draw:endL', uid, co_ordinates)

    });
    socket.on('draw:ends', function (uid, co_ordinates) {
        console.log('the event point ends');
        io.sockets.emit('draw:ends', uid, co_ordinates)

    });

    socket.on( 'textbox', function( data, session ) {

        console.log( "session " + session + " drew:");
        console.log( data );
        socket.broadcast.emit( 'textbox', data );

    });


   socket.on( 'drawRectangle', function(data, session){
        console.log( "session" + session + "drew:");
        console.log( data );
        socket.broadcast.emit( 'drawRectangle', data);
   });

    socket.on( 'drawCircle', function( data, session ) {

        console.log( "session " + session + " drew:");
        console.log( data );
        socket.broadcast.emit( 'drawCircle', data );

    });

});