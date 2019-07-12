from config import Config
from flask import Flask, current_app, request
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_session import Session
from flask_bootstrap import Bootstrap
from flask_babel import Babel, lazy_gettext as _l
from flask_mail import Mail
from flask_moment import Moment
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_recaptcha import ReCaptcha
from elasticsearch import Elasticsearch
from redis import Redis
from celery import Celery
from logging.handlers import SMTPHandler, RotatingFileHandler
import logging
import os


db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
login.login_view = 'auth.login'
login.login_message = ('Please log in to access this page.')
bootstrap = Bootstrap()
babel = Babel()
mail = Mail()
csrf = CSRFProtect()
moment = Moment()
socketio = SocketIO()
session = Session()
cors = CORS()
recaptcha = ReCaptcha()


# NEEDS TO BE OUTSIDE THE BP FACTORY TO BE CREATED OUTSIDE THE CLIENT'S FLASK APP AS ITS OWN WORKER APP
celery = Celery(__name__,
                broker=Config.CELERY_BROKER_URL,
                backend=Config.CELERY_RESULT_BACKEND,
                include=Config.CELERY_IMPORTS)

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)
    bootstrap.init_app(app)
    babel.init_app(app)
    mail.init_app(app)
    csrf.init_app(app)
    moment.init_app(app)
    socketio.init_app(app, manage_session=False)
    session.init_app(app)
    cors.init_app(app)
    recaptcha.init_app(app)

    app.redis = Redis.from_url(app.config['REDIS_URL'])
    celery.conf.update(app.config)

    from app.main import bp as main_bp
    app.register_blueprint(main_bp)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    from app.project import bp as proj_bp
    app.register_blueprint(proj_bp)

    from app.errors import bp as error_bp
    app.register_blueprint(error_bp)

    from app.socketio import bp as socketio_bp
    app.register_blueprint(socketio_bp)

    from app.api_user import bp as api_user_bp
    app.register_blueprint(api_user_bp, url_prefix='/api')
    csrf.exempt(api_user_bp)

    app.elasticsearch = Elasticsearch([app.config['ELASTICSEARCH_URL']]) \
        if app.config['ELASTICSEARCH_URL'] else None

    # FILE AND EMAIL LOGGING
    if not app.debug and not app.testing:
        if app.config['MAIL_SERVER']:
            auth = None
            if app.config['MAIL_USERNAME'] or app.config['MAIL_PASSWORD']:
                auth = (app.config['MAIL_USERNAME'], app.config['MAIL_PASSWORD'])
            secure = None
            if app.config['MAIL_USE_TLS']:
                secure = ()
            mail_handler = SMTPHandler(
                mailhost=(app.config['MAIL_SERVER'], app.config['MAIL_PORT']),
                fromaddr='no-reply@' + app.config['MAIL_SERVER'],
                toaddrs=app.config['ADMIN'], subject='smallWorld Server Failure',
                credentials=auth, secure=secure)
            mail_handler.setLevel(logging.ERROR)
            app.logger.addHandler(mail_handler)

        if not os.path.exists('logs'):
            os.mkdir('logs')
        file_handler = RotatingFileHandler('logs/smallWorld.log', maxBytes=10240,
                                        backupCount=10)
        file_handler.setFormatter(logging.Formatter(
            '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info('smallWorld startup')

    return app

@babel.localeselector
def get_locale():
    return request.accept_languages.best_match(current_app.config['LANGUAGES'])

from app import models