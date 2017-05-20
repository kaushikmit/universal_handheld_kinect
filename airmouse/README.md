Air Mouse and touchpad with full web technology.

## Technology used

* Server
  * [Express](http://expressjs.com/)
* Desktop
  * Application packager: [NW.js](https://github.com/nwjs/nw.js/) (Node Webkit)
  * Mouse action: [RobotJS](https://github.com/octalmage/robotjs/)
  * QRCode: [jquery qrcode](https://github.com/jeromeetienne/jquery-qrcode)
* Client
  * Touch detection: [HammerJs](http://hammerjs.github.io/)
  * Mobile accelerator: [DeviceOrientation](http://caniuse.com/#feat=deviceorientation)
* Shared
  * App Template: [Webapplate](https://github.com/webapplate/webapplate)
  * UI: [Bootstrap](https://github.com/twbs/bootstrap) CSS framework
  * Web socket: [socket.io](http://socket.io/) Real time communication

## Setup

Get required packages

```
$ npm install
```

Which will also run `bower install` to install related client side libraries into `public/vendor` folder.

Then run

```
$ node server.js
```

To host the mouse server on desktop.

## Code structure

The server side `server.js` manage the mouse position change, the client side send position offset to server. 

The desktop side `desktop.html` includes `server.js` and provide the connection instruction and system tray.

In client side `index.html`, just call emitMouse to update the mouse position.



