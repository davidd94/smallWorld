from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
from app.api_user.errors import error_response


basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


def verify_password(username, password):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    validation = user.check_password(password)

    if not validation:
        user.failed_login_counter()
    
    return validation

@token_auth.verify_token
def verify_token(token):
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None

@token_auth.error_handler
def token_auth_error():
    return error_response(401)

@basic_auth.error_handler
def basic_auth_error():
    return error_response(401)