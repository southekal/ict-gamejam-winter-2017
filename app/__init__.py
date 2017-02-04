import os
from flask import Flask, jsonify, request, render_template, redirect
from werkzeug.exceptions import BadRequest
import logging
from logging.config import fileConfig

fileConfig('app/logging_config.ini')
logger = logging.getLogger()


app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])


# Sample HTTP error handling
@app.errorhandler(404)
def not_found(error):
    logger.warning('page not found {} - {}'.format(error, request.url))
    return render_template('404.html'), 404


@app.errorhandler(BadRequest)
def handle_bad_request(e):
    logger.error('bad requests error {}'.format(e))
    return 'bad request!'


@app.route('/<name>', methods=['GET', 'POST'])
def hello_name(name):
    return jsonify({"name": name, "environment": os.environ['APP_SETTINGS']})


# from app.mod_auth.controllers import mod_auth as auth_module
from app.mod_landing.controllers import mod_landing as landing_module

# app.register_blueprint(auth_module)
app.register_blueprint(landing_module)
