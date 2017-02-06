# [ICT Winter Game Jam 2017](http://ictgamejam.com)
[![N|Solid](https://locotaco.herokuapp.com/static/img/intro/playgame.png)](https://locotaco.herokuapp.com)

## Installation

Install the dependencies and devDependencies to start the server.

```sh
$ cd folder
$ virtualenv venv
$ source venv/bin/activate (*Nix)
$ source venv/Scripts/activate (Windows)
$ pip install -r requirements.txt
```

Next, in your .env file, add the following:

```sh
source env/bin/activate
export APP_SETTINGS="config.DevelopmentConfig"
export SECRET_TOKEN = <secret>
export CSRF_SECRET_TOKEN = <secret>
```
Note: Create a secret.cfg file with config values in root folder

Run the following to update then refresh your .bashrc:

```sh
$ echo "source `which activate.sh`" >> ~/.bashrc
$ source ~/.bashrc
```

Now, if you move up a directory and then cd back into it, the virtual environment will automatically be started and the APP_SETTINGS variable is declared.

Start the server
```sh
$ python app.py
```
You will see Running on http://127.0.0.1:5000/
Access the url in your browser

## Objective

### 2 Player Game

#### Donald (To Win) - Keep building the wall and survive 45 seconds!

#####Controls:

W - Run Up

A - Run Left

S - Run Down

D - Run Right

Tab - Place Brick

####Enrique (To Win) - Collect Tacos and Destroy the wall!

#####Controls:

Up - Run Up

Left - Run Left

Down - Run Down

Right - Run Right

Spacebar - Throw Taco

[![N|Solid](https://locotaco.herokuapp.com/static/img/intro/playgame.png)](https://locotaco.herokuapp.com)
