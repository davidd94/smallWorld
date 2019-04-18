import os, time
from app import Config
from app import celery, create_app
from flask_mail import Message

app = create_app(os.getenv('FLASK_CONFIG') or Config)
app.app_context().push()

# TO START CELERY WORKER AFTER ACTIVATING VENV: celery worker -A app.celery --loglevel=info