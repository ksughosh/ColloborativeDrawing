
// The faster the user moves their mouse
// the larger the circle will be
// We dont want it to be larger than this
tool.minDistance = 10;
var uid =  (function() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
} () );

var send_paths_timer;
var timer_is_active = false;


// Returns an object specifying a semi-random color
// The color will always have a red value of 0
// and will be semi-transparent (the alpha value)
randomColor = function () {
  
  return {
    red: Math.random(),
    green: Math.random(),
    blue: Math.random(),
    alpha: ( Math.random() * 0.25 ) + 0.05
  };

}
var $user_count = $('#userCount');
var $user_count_wrapper = $('#userCountWrapper');
function update_user_count( count ) {

    $user_count_wrapper.css('opacity', 1);
    $user_count.text( (count === 1) ? " Your are the only user, why not invite others?" : " " + count );

}
function textbox(){
    alert("Clicked");
}
color = randomColor();
col2 = randomColor();
function onMouseDown(event) {

    var point = event.point;

    path = new Path();
    path.fillColor = color;
    path.add(event.point);

    // The data we will send every 100ms on mouse drag
    path_to_send = {
        rgba : color,
        start : event.point,
        path : []
    };


}

function onMouseDrag(event) {

    var step = event.delta / 2;
    step.angle += 90;

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    path.add(top);
    path.insert(0, bottom);
    path.smooth();

    // Add data to path
    path_to_send.path.push({
        top : top,
        bottom : bottom
    });

    // Send paths every 100ms
    if ( !timer_is_active ) {

        send_paths_timer = setInterval( function() {

            io.emit('draw:progress', uid, JSON.stringify(path_to_send) );
            path_to_send.path = new Array();

        }, 100);

    }

    timer_is_active = true;

}

function onMouseUp(event) {

    // Close the users path
    path.add(event.point);
    path.closed = true;
    path.smooth();

    // Send the path to other users
    path_to_send.end = event.point;
    io.emit('draw:end', uid, JSON.stringify(path_to_send) );

    // Stop new path data being added & sent
    clearInterval(send_paths_timer);
    path_to_send.path = new Array();
    timer_is_active = false;

}




//col = 'black';
// every time the user drags their mouse
// this function will be executed

tool1 = new Tool();
tool1.onMouseUp = function(event) {

  // Take the click/touch position as the centre of our circle
  var x = event.middlePoint.x;
  var y = event.middlePoint.y;
  var col = color	
  // The faster the movement, the bigger the circle
  var radius = event.delta.length / 2; 
 
  // Draw the circle 
  drawCircle( x, y, radius, col );
  
   // Pass the data for this circle
  // to a special function for later
  emitCircle( x, y, radius, col );

}


tool2 = new Tool();
tool2.onMouseUp = function(event){
    var x = event.downPoint.x;
    var y = event.downPoint.y;
    var width = event.delta.length * 0.8509;
    var height = event.delta.length * 0.5253;
    drawRectangle( x, y, width, height, color );
    emitRectangle( x, y, width, height, color );

}


tool3 = new Tool();
var path = new Path();
tool3.onMouseDown = onMouseDown;
tool3.onMouseDrag = onMouseDrag;
tool3.onMouseUp = onMouseUp;

tool4 = new Tool();

tool4.onMouseDrag = function(event) {

    // Take the click/touch position as the centre of our circle
    var x = event.middlePoint.x;
    var y = event.middlePoint.y;

    // The faster the movement, the bigger the circle
    var radius = event.delta.length / 2;

    // Generate our random color
    var color = randomColor();

    // Draw the circle
    drawCircle( x, y, radius, color );

    // Pass the data for this circle
    // to a special function for later
    emitCircle( x, y, radius, color );

}
//line tool
tool5 = new Tool();
tool5.onMouseDown = function( event ){
    var point = event.point;

    path = new Path();
    path.strokeColor = color;
    path.add(event.point);

    // The data we will send every 100ms on mouse drag
    path_to_send = {
        rgba : color,
        start : event.point,
        path : []
    };
}

tool5.onMouseDrag = function onMouseDrag(event) {

    var top = event.point;

    // Add data to path
    path_to_send.path.push({
        top : top

    });

    // Send paths every 100ms
    if ( !timer_is_active ) {

        send_paths_timer = setInterval( function() {

            io.emit('draw:progresses', uid, JSON.stringify(path_to_send) );
            path_to_send.path = new Array();

        }, 100);

    }

    timer_is_active = true;

}
tool5.onMouseUp=function(event) {

    path.lineTo(event.point)
    path.strokeWidth = 3;
    path_to_send.end = event.point;
    io.emit('draw:ends', uid, JSON.stringify(path_to_send) );

    // Stop new path data being added & sent
    clearInterval(send_paths_timer);
    timer_is_active = false;

    view.draw();
}

tool6 = new Tool();
tool6.onMouseDown = function ( event ){
    var point = event.point;
    var color = 'white';
    path = new Path();
    path.fillColor = color;
    path.add(event.point);

    // The data we will send every 100ms on mouse drag
    path_to_send = {
        rgba : color,
        start : event.point,
        path : []
    };
}
tool6.onMouseDrag = onMouseDrag;
tool6.onMouseUp = onMouseUp;


tool7 = new Tool();
var path = new Path();
tool7.onMouseDown = function(event) {

    var point = event.point;

    path = new Path();
    path.strokeColor = color;
    path.strokeWidth = 3;
    path.add(event.point);

    // The data we will send every 100ms on mouse drag
    path_to_send = {
        rgba : color,
        start : event.point,
        path : []
    };
}
tool7.onMouseDrag = function(event) {
    var top = event.middlePoint;

    path.add(top);
    path.smooth();

    // Add data to path
    path_to_send.path.push({
        top : top

    });

    // Send paths every 100ms
    if ( !timer_is_active ) {

        send_paths_timer = setInterval( function() {

            io.emit('draw:progressL', uid, JSON.stringify(path_to_send) );
            path_to_send.path = new Array();

        }, 100);

    }

    timer_is_active = true;

}
tool7.onMouseUp = function(event) {
    path.smooth();

    // Send the path to other users
    path_to_send.end = event.point;
    io.emit('draw:endL', uid, JSON.stringify(path_to_send) );

    // Stop new path data being added & sent
    clearInterval(send_paths_timer);
    timer_is_active = false;

}

tool8 = new Tool();

tool8.onMouseDown = function (event){
    var x = event.point.x;
    var y = event.point.y;
    var s = prompt ("Enter the text:");
    textbox(x,y,color,s);
    emitbox(x,y,color,s);
}

//functions to draw the geometric figures

function drawRectangle( x, y, width, height, color ){
    var rect = new Path.Rectangle({
        x: x,
        y: y,
        width: width,
        height: height

    });
    rect.strokeColor = color;
    rect.fillColor = color;

    view.draw();
}

function drawCircle( x, y, radius, color ) {

  // Render the circle with Paper.js
  var circle = new Path.Circle( new Point( x, y ), radius );
  circle.fillColor = color

  // Refresh the view, so we always get an update, even if the tab is not in focus
  view.draw();
}

function textbox(x,y,color,s){
    ctext = new PointText(new Point(x, y));
    ctext.fillColor = color;
    ctext.content = s;
    view.draw();
}

//functions to emit the geometric figures
// This function sends the data for a circle to the server
// so that the server can broadcast it to every other user
function emitCircle( x, y, radius, color ) {

  // Each Socket.IO connection has a unique session id

  var sessionId = io.socket.sessionid;
  // An object to describe the circle's draw data
  var data = {
    x: x,
    y: y,
    radius: radius,
    color: color
  };

  // send a 'drawCircle' event with data and sessionId to the server
  io.emit( 'drawCircle', data, sessionId )

  // Lets have a look at the data we're sending
  console.log( data )

}

function emitRectangle(x, y, width, height, color){

    var sessionId = io.socket.sessionid;
    var data = {
        x: x,
        y: y,
        width: width,
        height:height,
        color: color
    };


    // send a event with data and sessionId to the server
    io.emit( 'drawRectangle', data, sessionId )

    // Lets have a look at the data we're sending
    console.log( data )
}

function emitbox(x,y,color,s){
    var sessionId = io.socket.sessionid;
    var data = {
        x: x,
        y: y,
        color: color,
        s: s
    }
    io.emit('textbox',data,sessionId);
}
// created by other users

io.on( 'textbox', function( data ){

    console.log('textbox event received:', data);

    textbox(data.x,data.y,data.color,data.s);
})

io.on( 'drawRectangle', function( data ){

    console.log( 'drawRectangle event received:', data);

    drawRectangle(data.x, data.y, data.width, data.height, data.color);
})

io.on( 'drawCircle', function( data ) {

  console.log( 'drawCircle event received:', data );

  // Draw the circle using the data sent
  // from another user
  drawCircle( data.x, data.y, data.radius, data.color );
  
})

io.on('draw:progresses', function( artist, data ) {

    // It wasnt this user who created the event
    if ( artist !== uid && data ) {

        progress_external_paths( JSON.parse( data ), artist );

    }
})

io.on('draw:progress', function( artist, data ) {

    // It wasnt this user who created the event
    if ( artist !== uid && data ) {

        progress_external_path( JSON.parse( data ), artist );

    }
})

io.on('draw:progressL', function( artist, data ) {

    // It wasnt this user who created the event
    if ( artist !== uid && data ) {

        progress_external_pathL( JSON.parse( data ), artist );

    }
})

io.on('draw:end', function( artist, data ) {

    // It wasnt this user who created the event
    if ( artist !== uid && data ) {
        end_external_path( JSON.parse( data ), artist );
    }

})

io.on('draw:endL', function( artist, data ) {

    // It wasnt this user who created the event
    if ( artist !== uid && data ) {
        end_external_pathL( JSON.parse( data ), artist );
    }

})

io.on('draw:ends', function( artist, data ) {

    // It wasnt this user who created the event
    if ( artist !== uid && data ) {
        end_external_paths( JSON.parse( data ), artist );
    }

})

io.on('user:connect', function(user_count) {
    update_user_count( user_count );
})

io.on('user:disconnect', function(user_count) {
    update_user_count( user_count );
})

//functions for user specific draw without sessionID
var external_paths = {};

// Ends a path
var end_external_path = function( points, artist ) {

    var path = external_paths[artist];

    if ( path ) {

        // Close the path
        path.add(points.end);
        path.closed = true;
        path.smooth();

        // Remove the old data
        external_paths[artist] = false;
        view.draw();

    }

};

var end_external_pathL = function( points, artist ) {

    var path = external_paths[artist];

    if ( path ) {

        // Close the path
        path.add(points.end);
        path.strokeWidth = 3;
        path.smooth();
        // Remove the old data
        external_paths[artist] = false;
        view.draw();

    }

};

// Continues to draw a path in real time

progress_external_path = function( points, artist ) {


    var path = external_paths[artist];

    // The path hasn't already been started
    // So start it
    if ( !path ) {

        // Creates the path in an easy to access way
        external_paths[artist] = new Path();
        path = external_paths[artist];

        // Starts the path
        var start_point = new Point(points.start.x, points.start.y);
        var color = points.rgba;
        path.fillColor = color;
        path.add(start_point);

    }

    // Draw all the points along the length of the path
    var paths = points.path;
    var length = paths.length;
    for (var i = 0; i < length; i++ ) {

        path.add(paths[i].top);
        path.insert(0, paths[i].bottom);
    }

    path.smooth();


    view.draw();



};

progress_external_pathL = function( points, artist ) {


    var path = external_paths[artist];

    // The path hasnt already been started
    // So start it
    if ( !path ) {

        // Creates the path in an easy to access way
        external_paths[artist] = new Path();
        path = external_paths[artist];

        // Starts the path
        var start_point = new Point(points.start.x, points.start.y);
        var color = points.rgba;
        path.strokeColor = color;
        path.add(start_point);
        path.smooth();
        path.strokeWidth = 3;
    }

    // Draw all the points along the length of the path
    var paths = points.path;
    var length = paths.length;
    for (var i = 0; i < length; i++ ) {

        path.add(paths[i].top);
    }

    path.smooth();
    view.draw();
};

progress_external_paths = function( points, artist ) {

    var path = external_paths[artist];

    // The path hasn't already been started
    // So start it
    if ( !path ) {

        // Creates the path in an easy to access way
        external_paths[artist] = new Path();
        path = external_paths[artist];

        // Starts the path

    }
}

var end_external_paths = function( points, artist ) {

    var path = external_paths[artist];

    if ( path ) {

        // Close the path
        var start_point = new Point(points.start.x, points.start.y);
        var end_point = new Point(points.end.x, points.end.y);
        var color = points.rgba;
        var line = new Path.Line (start_point,end_point);
        line.strokeColor = color;
        line.strokeWidth = 3;

        path.lineTo(points.end);
        path.smooth();

        // Remove the old data
        external_paths[artist] = false;

        view.draw();

    }

};






