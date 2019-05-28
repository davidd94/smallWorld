from flask import Blueprint

bp = Blueprint('api_server', __name__)

from app.api_server import tokens, auth