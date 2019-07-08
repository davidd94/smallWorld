from app import db
from app.api_user import bp
from app.models import User
from app.auth.forms import RegistrationForm, PasswordResetRequestForm
from app.email import send_confirmation_email, send_password_reset_email
from app.api_user.errors import bad_request
from app.api_user.auth import token_auth, verify_password
from app.api_user.tokens import get_token
from app.schema import schema
from flask import jsonify, request, url_for, g, abort
from flask_graphql import GraphQLView
from datetime import datetime, timedelta
import json


bp.add_url_rule('/graphql', view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True))

# CUSTOM GRAPHQL VIEW FUNCTION (NOT RECOMMENDED FOR PRODUCTION)
"""@bp.route('/graphql', methods=['POST'])
def graphql():
    print(request.data)
    data = json.loads(request.data)
    print(data)
    return json.dumps(schema.execute(data['query']).data)"""


@bp.route('/login', methods=['POST'])
def get_login():
    username = request.json['username']
    password = request.json['password']
    
    if verify_password(username, password):
        if g.current_user.max_failed_login >= 10:
            return jsonify('Reached maximum login attempts. Please reset your password.')
        return get_token()
    
    return jsonify('Invalid Username and Password combination!')

@bp.route('/register', methods=['POST'])
def register_user():
    print(request.json)
    form = RegistrationForm(firstname=request.json['firstname'],
                            lastname=request.json['lastname'],
                            username=request.json['username'],
                            email=request.json['email'],
                            password=request.json['password'],
                            repassword=request.json['repassword'],
                            csrf_enabled=False)
    if form.validate():
        lowercased_email = (form.email.data).lower()
        newuser = User(username=form.username.data,
                        firstname=form.firstname.data,
                        lastname=form.lastname.data,
                        email=lowercased_email,
                        max_failed_login=0)
        newuser.create_password(form.password.data)
        
        db.session.add(newuser)
        newuser.picture = newuser.avatar(70)
        
        db.session.commit()
        send_confirmation_email(newuser)
        return jsonify('New account created !')
    
    if form.errors:
        for error in (form.firstname.errors or form.lastname.errors \
        or form.username.errors or form.email.errors \
        or form.password.errors or form.repassword.errors):
            return jsonify(error)
        
    return jsonify('Failed to create account')

@bp.route('/reset_user_password', methods=['POST'])
def reset_user_password():
    form = PasswordResetRequestForm(email=request.json['email'], csrf_enabled=False)
    if form.validate():
        lowercased_email = (form.email.data).lower()
        user = User.query.filter_by(email=lowercased_email).first()
        if user:
            send_password_reset_email(user)
            return jsonify('A new password link will be sent to your email.')
        return jsonify('A new password link will be sent to your email.')
    return jsonify('A valid email is required.')

@bp.route('/reauth_token', methods=['POST'])
def reauth_token():
    old_token = request.json['old_token']
    user = User.query.filter_by(token=old_token).first()
    if user:
        now = datetime.utcnow()
        # gives the user 10 min grace period to auto-renew token
        grace_period = timedelta(minutes=10)
        token_expiration = user.token_expiration
        if abs(now - token_expiration) <= grace_period:
            user.get_token()
            db.session.commit()
            return jsonify(user.token)
    return jsonify('Failed to reauth. Please log in again.')

@bp.route('/email_notifications', methods=['POST'])
@token_auth.login_required
def email_notifications():
    settings = request.json
    user = g.current_user
    print(settings)
    print(user)
    if settings and user:
        user.msg_note = settings['msg']
        user.comment_note = settings['comment']
        user.reply_note = settings['reply']

        db.session.commit()

        return jsonify(settings)
    
    return jsonify('Unable to save email notification settings')

@bp.route('/delete_acct', methods=['POST'])
@token_auth.login_required
def delete_acct():
    user = g.current_user
    approval = request.json['confirmation']
    if approval:
        projects = Projects.query.filter_by(user_id=user.id).all()
        if projects:
            for project in projects:
                photo_gallery = project.photo_gallery.first()
                project_faqs = project.faqs.first()
                project_itemlist = project.item_list.all()
                project_comments = project.project_comments.all()
                project_replies = project.comment_replies.all()
                
                # REMOVING PROJECT AND ALL RELATED TABLES
                db.session.delete(project)
                db.session.delete(photo_gallery)
                db.session.delete(project_faqs)
                if project_itemlist:
                    for eachitem in project_itemlist:
                        db.session.delete(eachitem)
                if project_comments:
                    for eachcomment in project_comments:
                        db.session.delete(eachcomment)
                if project_replies:
                    for eachreply in project_replies:
                        db.session.delete(eachreply)
        
        messages = Messages.query.filter_by(recipient_id=user.id).all()
        if messages:
            for message in messages:
                db.session.delete(message)
        
        notifications = Notifications.query.filter_by(user_id=user.id).all()
        if notifications:
            for eachnote in notifications:
                db.session.delete(eachnote)
        
        # REMOVING MAIN USER DIRECTORY WITH ALL PROJECTS AND IMAGES
        file_path = current_app.config['PHOTO_UPLOAD_DIR']
        if os.path.isdir(file_path + '/' + user.username):
            # shutil IS REQUIRED TO REMOVE ALL FILES AND SUBDIRECTORIES WITHIN A DIRECTORY. rmdir only removes when empty
            shutil.rmtree(file_path + '/' + user.username)
        logout_user()
        db.session.delete(user)
        db.session.commit()
        return jsonify('Account successfully deleted!')
    return jsonify('something failed')


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