import os
import ConfigParser
basedir = os.path.abspath(os.path.dirname(__file__))


cfg = ConfigParser.ConfigParser()
cfg.read('secret.cfg')


class Config(object):
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SECRET_KEY = cfg.get("SECRET", "SECRET_TOKEN")
    THREADS_PER_PAGE = 2
    # Use a secure, unique and absolutely secret key for
    # signing the data.
    CSRF_SESSION_KEY = cfg.get("SECRET", "CSRF_SECRET_TOKEN")


class ProductionConfig(Config):
    DEBUG = False


class StagingConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class DevelopmentConfig(Config):
    DEVELOPMENT = True
    DEBUG = True


class TestingConfig(Config):
    TESTING = True