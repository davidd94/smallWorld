from flask import Flask, current_app, request
from flask_wtf.csrf import CSRFProtect
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_session import Session
from flask_bootstrap import Bootstrap
from flask_babel import Babel, lazy_gettext as _l
from flask_mail import Mail
from flask_moment import Moment
from elasticsearch import Elasticsearch
from redis import Redis
from celery import Celery
from flask_socketio import SocketIO


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


# NEEDS TO BE OUTSIDE THE BP FACTORY TO BE CREATED OUTSIDE THE CLIENT'S FLASK APP AS ITS OWN WORKER APP
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL)

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

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    app.elasticsearch = Elasticsearch([app.config['ELASTICSEARCH_URL']]) \
        if app.config['ELASTICSEARCH_URL'] else None

    return app

@babel.localeselector
def get_locale():
    return request.accept_languages.best_match(current_app.config['LANGUAGES'])

from app import models