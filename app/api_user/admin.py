from app import db
from app.api_user import bp
from app.models import User, AdminBlogPosts
from app.api_user.errors import bad_request
from app.api_user.tokens import get_token, token_auth
from flask import jsonify, request, current_app, g
import json


@bp.route('/admincheck', methods=['GET'])
@token_auth.login_required
def admin_check():
    user = g.current_user
    if user.username == 'Davie' and user.email == 'investmentracker1@gmail.com':
        return jsonify('You have admin access to this page')
    return jsonify('Admin access denied')

@bp.route('/newblog', methods=['POST'])
@token_auth.login_required
def admin_newblog():
    user = g.current_user
    if user.username == 'Davie' and \
    user.email == 'investmentracker1@gmail.com' and \
    request.json['title'] and \
    request.json['text']:
        new_blog = AdminBlogPosts(username=user.username,
                                    title=request.json['title'],
                                    body=request.json['text'],
                                    url=request.json['url'],
                                    user_id=user.id)
        db.session.add(new_blog)
        db.session.commit()
        return jsonify('saved blog post!')
    return jsonify('Unauthorized to do this!')