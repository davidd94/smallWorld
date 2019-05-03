import os
from dotenv import load_dotenv


basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(basedir, 'env'))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'

    LANGUAGES = ['en', 'es']

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USERNAME = 'smallWorld949@gmail.com'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = 'smallWorld949@gmail.com'
    ADMIN = 'smallWorld949@gmail.com'

    MESSAGES_PER_PAGE = 30
    PROJECTS_PER_PAGE = 10

    SESSION_COOKIE_SECURE = False

    PHOTO_UPLOAD_DIR = os.path.join(basedir, 'app/static/users')
    ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024

    ELASTICSEARCH_URL = os.environ.get('ELASTICSEARCH_URL')

    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://'
    CELERY_BROKER_URL = 'redis://127.0.0.1:6379/0'
    CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/0'
    CELERY_IMPORTS = ['app.tasks']