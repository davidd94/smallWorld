from flask import jsonify, g
from flask_wtf.csrf import generate_csrf
from app import db
from app.api_user import bp
from app.api_user.auth import basic_auth, token_auth


@bp.route('/csrf_token')
def fetch_CSRFToken():
    CSRFToken = generate_csrf()
    return jsonify(CSRFToken)

@bp.route('/tokens', methods=['POST'])
@basic_auth.login_required
def get_token():
    token = g.current_user.get_token()
    db.session.commit()
    return jsonify({'token': token})

@bp.route('/tokens', methods=['DELETE'])
@token_auth.login_required
def revoke_token():
    g.current_user.revoke_token()
    db.session.commit()
    return '', 204