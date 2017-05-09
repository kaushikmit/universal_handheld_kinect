from gevent import monkey
monkey.patch_all()

import time
from threading import Thread
from flask import Flask, render_template, session, request, redirect
from flask.ext.socketio import SocketIO, emit, join_room, leave_room, \
    close_room, disconnect

from flask_bootstrap import Bootstrap

import redis

p = redis.ConnectionPool()


app = Flask(__name__, static_folder='static')
app.debug = True
app.config['SECRET_KEY'] = 'secret!'
Bootstrap(app)
socketio = SocketIO(app)
thread = None


def background_thread():
    """Dummy Thread"""


@app.route('/')
def index():
    global thread
    if thread is None:
        thread = Thread(target=background_thread)
        thread.start()
    return render_template('index.html')

@app.route('/previndex')
def previndex():
    global thread
    if thread is None:
        thread = Thread(target=background_thread)
        thread.start()
    return render_template('previndex.html')


@app.route('/receiver/<path:path>')
def receiver(path):
    return render_template('receiver/'+"receiver.html")

@app.route('/app/<path:path>')
def app_renderer(path):
    return render_template('app/'+"heart.html")

@app.route('/app/renderer')
def renderer():
    return render_template('app/'+"renderer.html")

@app.route('/app/heartrenderer')
def heartrenderer():
    return render_template('app/'+"heartrenderer.html")

@app.route('/app/presentation')
def app_presenter():
    return render_template('app/'+"presentation.html")

@app.route('/app/objrenderer')
def objrenderer():
    return render_template('app/' + "objrenderer.html")

@app.route('/app/3drenderer')
def renderer3d():
    return render_template('app/' + "3drenderer.html")

@app.route('/app/slideshow')
def slideshow():
    return render_template("app/" + "slideshow.html")

@app.route('/app/airmouse')
def airmouse():
    return render_template("app/" + "airmouse.html")

"""
    Socket.io stream receiver
"""

@socketio.on('model::GYRO_STREAM', namespace='/model')
def heart_gyro_receiver(message):
    r = redis.Redis(connection_pool=p)
    # Publish data on Redis PUB-SUB Channel
    r.publish('model::GYRO_STREAM', message)
    # Broadcast data to all connected clients
    emit('model::GYRO_STREAM', message, broadcast=True)


@socketio.on('model::ACCEL_STREAM', namespace='/model')
def heart_gyro_receiver(message):
    r = redis.Redis(connection_pool=p)
    # Publish data on Redis PUB-SUB Channel
    r.publish('model::ACCEL_STREAM', message)
    # Broadcast data to all connected clients
    emit('model::ACCEL_STREAM', message, broadcast=True)

@socketio.on('model::COMMANDS', namespace='/model')
def heart_commands_receiver(message):
    r = redis.Redis(connection_pool=p)
    # Publish data on Redis PUB-SUB Channel
    r.publish('model::COMMANDS', message)
    # Broadcast data to all connected clients
    emit('model::COMMANDS', message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0")

