import os
from dotenv import load_dotenv


basedir = os.path.abspath(os.path.dirname(__file__))

load_dotenv(os.path.join(basedir, 'env'))


class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'

    RECAPTCHA_ENABLED = True
    RECAPTCHA_PUBLIC_KEY = os.environ.get('RECAPTCHA_PUBLIC_KEY') or '6LeXGa0UAAAAAAjJeDYYWkxN8XG_r9iOplBrByeA'
    RECAPTCHA_PRIVATE_KEY = os.environ.get('RECAPTCHA_PRIVATE_KEY') or None

    LANGUAGES = ['en', 'es']

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') is not None
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

    WEBPACK_STATS_FILE = os.path.join(basedir, 'app/static/users')
    WEBPACK_BUNDLE_PATH = os.path.join(basedir, 'app/static/dist/bundle.js')

    STRIPE_PUB_KEY = os.environ.get('STRIPE_PUB_KEY') or None
    STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY') or None

    TWITTER_KEY = os.environ.get('TWITTER_CONSUMER_KEY') or None
    TWITTER_SECRET_KEY = os.environ.get('TWITTER_CONSUMER_SECRET_KEY') or None
    TWITTER_ACCESS_TOKEN = os.environ.get('TWITTER_ACCESS_TOKEN') or None
    TWITTER_ACCESS_SECRET_TOKEN = os.environ.get('TWITTER_ACCESS_SECRET_TOKEN') or None

    REBRANDLY_KEY = os.environ.get('REBRANDLY_KEY') or None

    # ONLY USED FOR DEVELOPMENT/TESTING ONLY
    #WTF_CSRF_CHECK_DEFAULT = False