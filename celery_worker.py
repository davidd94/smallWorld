import os, time
from app import Config
from app import celery, create_app
from flask_mail import Message

app = create_app(os.getenv('FLASK_CONFIG') or Config)
app.app_context().push()

"""
FOR MAC HOSTING:
TO START CELERY WORKER AFTER ACTIVATING VENV & GO TO WEBAPP MAIN DIRECTORY: celery worker -A app.celery --loglevel=info

FOR WINDOWS HOSTING:
CERERY 4.0+ IS NO LONGER SUPPORTED ON WINDOWS.
MUST DOWNGRADE TO 3.1.25 OR USE EVENTLET WITH CELERY AND REDIS.
THEN ACTIVATE VENV AND RUN: celery -A app.celery worker -l info -P eventlet
MAKE SURE THE 'bind network' IP IN REDIS CONFIG (127.0.0.1) IS USED IN config.py (REDIS BROKER & BACKEND)

"""