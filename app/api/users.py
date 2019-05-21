from app import db
from app.api import bp
from app.models import User
from app.api.errors import bad_request
from app.api.auth import token_auth
from flask import jsonify, request, url_for, g, abort


@bp.route('/users/<int:id>', methods=['GET'])
@token_auth.login_required
def get_user(id):
    return jsonify(User.query.get_or_404(id).to_dict())

@bp.route('/users', methods=['GET'])
@token_auth.login_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(User.query, page, per_page, 'api.get_users')
    return jsonify(data)

@bp.route('/users/<int:id>/followers', methods=['GET'])
def get_followers(id):
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(user.followers, page, per_page,
                                   'api.get_followers', id=id)
    return jsonify(data)

@bp.route('/users/<int:id>/followed', methods=['GET'])
def get_followed(id):
    user = User.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 10, type=int), 100)
    data = User.to_collection_dict(user.followed, page, per_page,
                                   'api.get_followed', id=id)
    return jsonify(data)

@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    if 'username' not in data or \
        'firstname' not in data or \
        'lastname' not in data or \
        'email' not in data or \
        'password' not in data:
        return bad_request('Must include username,first name, lastname, email, and password fields')
    if User.query.filter_by(username=data['username']).first():
        return bad_request('That username already exist. Please use a different username')
    if User.query.filter_by(email=data['email']).first():
        return bad_request('That email already exist. Please use a different email')
    user = User()
    user.from_dict(data, new_user=True)
    db.session.add(user)
    db.session.commit()
    response = jsonify(user.to_dict())
    response.status_code = 201
    response.headers['Location'] = url_for('api.get_user', id=user.id)
    return response

@bp.route('/users/<int:id>', methods=['PUT'])
@token_auth.login_required
def update_user(id):
    # CHECKS WHETHER USER IS THE SAME USER TO EDIT INFO
    if g.current_user.id != id:
        abort(403)
    user = User.query.get_or_404(id)
    data = request.get_json() or {}
    if 'firstname' in data and \
    data['firstname'] != user.firstname:
        return bad_request('You are already using this first name')
    
    if 'lastname' in data and \
    data['lastname'] != user.lastname:
        return bad_request('You are already using this last name')
    
    if 'email' in data \
    and data['email'] != user.email and \
    User.query.filter_by(email=data['email']).first():
        return bad_request('That email has been used already. Please use a different email address')
    
    if 'password' in data and 'repassword' in data:
        if data['password'] != data['repassword']:
            return bad_request('Your password must be matching')
        elif len(data['password']) < 5 or len(data['repassword']) < 5:
            return bad_request('Your password must be a minimum of 5 characters long')
        user.from_dict(data, new_user=True)
        db.session.commit()
        return jsonify(user.to_dict())

    user.from_dict(data, new_user=False)
    db.session.commit()
    return jsonify(user.to_dict())