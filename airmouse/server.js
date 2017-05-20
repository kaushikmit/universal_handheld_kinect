/* jshint node: true */
'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var robot = require('robotjs');
var config = require('./public/js/config.js');

var screenWidth = 1440;
var screenHeight = 900;

// Get screen size from NW desktop
try {
  var gui = window.require('nw.gui');
  gui.Screen.Init();
  var screens = gui.Screen.screens;
  // XXX: currently only take first screen
  var rect = screens[0].bounds;
  screenWidth = rect.width;
  screenHeight = rect.height;
} catch (e) {
  console.log(e);
}

var adjustment = 2;
var mouse = null;
var newX = null;
var newY = null;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/client.html');
});


app.use('/public', express.static('public'));


io.on('connection', function(socket) {
  socket.broadcast.emit('hi');
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('mouse', function(pos) {
    if (pos.pw) {
      if (config.passcode !== pos.pw) {
        return;
      }
    }
    if (pos.cmd == 'move' || pos.cmd == 'scroll' || pos.cmd == 'drag') {
      mouse = robot.getMousePos();
      //console.log("Mouse is at x:" + mouse.x + " y:" + mouse.y);
      newX = mouse.x + pos.x * adjustment;
      newY = mouse.y + pos.y * adjustment;
      //console.log('Offset is x:'+ newX + ' y:' + newY);
      //robot.moveMouseSmooth(newX, newY);
      robot.moveMouse(newX, newY);
      mouse = robot.getMousePos();
      //console.log("after x:" + mouse.x + " y:" + mouse.y);
    } else if (pos.cmd == 'motion') {
      var x = pos.x;
      var y = pos.y;
      x = (x < 45) ? 45 : x;
      x = (x > 135) ? 135 : x;
      y = (y < 105) ? 105 : y;
      y = (y > 165) ? 165 : y;
      x -= 45;
      y -= 105;
      robot.moveMouse(screenWidth / 90 * x, screenHeight / 60 * y);
    } else if (pos.cmd == 'click') {
      robot.mouseClick();
      // robot.typeString(msg);
    } else if (pos.cmd == 'rightclick') {
      robot.mouseClick('right');
    } else if (pos.cmd == 'scrollstart') {
      robot.mouseToggle('down', 'middle');
    } else if (pos.cmd == 'scrollend') {
      robot.mouseToggle('up', 'middle');
    } else if (pos.cmd == 'dragstart') {
      robot.mouseToggle('down', 'left');
    } else if (pos.cmd == 'dragend') {
      robot.mouseToggle('up', 'left');
    } else if (pos.cmd == 'right') {
      robot.keyTap("right");
    } else if (pos.cmd == 'left') {
      robot.keyTap("left");
    }
    // send to everyone
    //io.emit('mouse', pos);
  });
});

var PORT = 8000;
http.listen(PORT, function() {
  console.log('listening on *:' + PORT);
});

