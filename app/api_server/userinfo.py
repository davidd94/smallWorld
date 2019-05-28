from app import db
from app.api_server import bp
from app.models import User
from app.api_server.auth import token_auth
from flask import jsonify, request, url_for, g, abort


@bp.route('/csrf_token')
def fetch_CSRFToken():
    CSRFToken = generate_csrf()
    return jsonify(CSRFToken)


@bp.route('/email_notifications')
@login_required
def fetch_emailNotes():
    user = current_user
    data = {
        'msg': user.msg_note,
        'comment': user.comment_note,
        'reply': user.reply_note
    }
    return jsonify(data)