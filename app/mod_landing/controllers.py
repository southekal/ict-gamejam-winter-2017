from flask import Blueprint, request, render_template, flash, g, session, redirect, url_for
from werkzeug import check_password_hash, generate_password_hash


mod_landing = Blueprint('landing', __name__, url_prefix='')


@mod_landing.route('/', methods=['GET', 'POST'])
def index():
    return render_template("landing/home.html")


@mod_landing.route('/game', methods=['GET', 'POST'])
def game():
    return render_template("landing/about.html")


@mod_landing.route('/shoot', methods=['GET', 'POST'])
def shoot():
    return render_template("shoot.html")


@mod_landing.route('/about', methods=['GET', 'POST'])
def about():
    return render_template("index.html")
