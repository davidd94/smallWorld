from flask import render_template, redirect, url_for, request, flash, session, current_app
from flask_login import current_user, login_user, logout_user
from app import db
from app.email import send_email, send_confirmation_email, send_password_reset_email
from app.models import User, Projects, Notifications, followers
from app.auth import bp
from app.auth.forms import LoginForm, RegistrationForm, PasswordResetRequestForm, PasswordResetForm
from app.main.forms import SearchForm, MessageForm
from werkzeug.urls import url_parse
import requests
import json


# USE IF NOT USING REVERSE PROXY (NGINX) TO CONVERT AT HTTP REQUEST TO HTTPS
"""@bp.before_request
def enforceHttps():
  if request.headers.get('X-Forwarded-Proto') == 'http':
    url = request.url.replace('http://', 'https://', 1)
    code = 301
    return redirect(url, code=code)"""

@bp.route('/clear_flash_msgs')
def clear_flash_msgs():
    session.pop('_flashes', None)
    return redirect(url_for('auth.homepage'))

@bp.route('/', methods=['GET', 'POST'])
def homepage():
    if current_user.is_authenticated:
        followed_users = current_user.followed.all()
        public_projects = []
        form = MessageForm()
        for eachuser in followed_users:
            # FILTERING EACH USER'S PROJECT PRIVACY SETTINGS
            projects = eachuser.all_projects \
                                .filter(Projects.private != 1) \
                                .order_by(Projects.last_edit.desc()) \
                                .all()
            for project in projects:
                public_projects.append(project)
        return render_template('homepage.html', public_projects=public_projects, form=form)
    form = LoginForm()
    return render_template('homepage.html', form=form)

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('auth.homepage'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.max_failed_login >= 10:
            flash('You have reached your maximum login attempts.')

            # MAINTAINING REQUEST.ARGS AFTER FAILED LOGIN ATTEMPTS
            if request.args.get('next') == 'project-page':
                return redirect(url_for('auth.login',
                                        next=request.args.get('next'),
                                        title=request.args.get('title'),
                                        username=request.args.get('username')))
            elif request.args.get('next') == 'login-page':
                return redirect(url_for('auth.login'))
            # REDIRECTS FROM FAILED LOGIN ATTEMPTS IN HOMEPAGE
            return redirect(url_for('auth.homepage'))
        if user is None or not user.check_password(form.password.data):
            if user:
                user.failed_login_counter()
            flash('Invalid user name and password combination.')

            # MAINTAINING REQUEST.ARGS AFTER FAILED LOGIN ATTEMPTS
            if request.args.get('next') == 'project-page':
                return redirect(url_for('auth.login',
                                        next=request.args.get('next'),
                                        title=request.args.get('title'),
                                        username=request.args.get('username')))
            elif request.args.get('next') == 'login-page':
                return redirect(url_for('auth.login'))
            # REDIRECTS FROM FAILED LOGIN ATTEMPTS IN HOMEPAGE
            return redirect(url_for('auth.homepage'))
        """if user.verified == False:
            flash('Please check your email to verify your account before logging in.')

            # MAINTAINING REQUEST.ARGS AFTER FAILED LOGIN ATTEMPTS
            if request.args.get('next') == 'project-page':
                return redirect(url_for('auth.login',
                                        next=request.args.get('next'),
                                        title=request.args.get('title'),
                                        username=request.args.get('username')))
            elif request.args.get('next') == 'login-page':
                return redirect(url_for('auth.login'))
            # REDIRECTS FROM FAILED LOGIN ATTEMPTS IN HOMEPAGE
            return redirect(url_for('auth.homepage'))
        """
        login_user(user, remember=form.remember_me.data)
        user.max_failed_login = 0
        # NEED TO UPDATE LOGIN STATUS FOR CHAT FEATURE
        user.online = 'online'
        session['chat_status'] = 'online'
        session['chatlist'] = []
        db.session.commit()
        
        # THIS REDIRECT USERS TO THEIR PREVIOUS PAGE AFTER LOGIN
        next_page = request.args.get('next')
        if next_page == 'project-page':
            username = request.args.get('username')
            title = request.args.get('title')
            next_page = url_for('project.project', username=username, title=title)
        # REDIRECTS TO HOMEPAGE AFTER LOGIN & PREVENTS USERS FROM REDIRECTING BACK TO THEIR MALICIOUS SITE AFTER LOGIN
        elif not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('auth.homepage')
        else:
            next_page = url_for('auth.homepage')
        return redirect(next_page)
    return render_template('auth/login.html', form=form)

@bp.route('/logout', methods=['GET', 'POST'])
def logout():
    # NEED TO UPDATE LOGIN STATUS FOR CHAT FEATURE
    current_user.online = 'offline'
    db.session.commit()

    session.clear()
    logout_user()
    return redirect(url_for('auth.clear_flash_msgs'))

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('auth.homepage'))
    recaptchakey = current_app.config['RECAPTCHA_PUBLIC_KEY']
    form = RegistrationForm()
    if form.validate_on_submit():
        recaptchadata = request.form['g-recaptcha-response']
        r = requests.post('https://www.google.com/recaptcha/api/siteverify', data = {'secret': current_app.config['RECAPTCHA_PRIVATE_KEY'], 'response': recaptchadata}, timeout=10)
        google_response = json.loads(r.text)    #CONVERTS GOOGLE'S RESPONSE
        if google_response['success'] == False:
            flash('Captcha authentication failed !')
            return redirect(url_for('auth.register'))

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
        flash('You have created your new account! Please check your email to verify your account.')
        send_confirmation_email(newuser)
        return redirect(url_for('auth.register'))
    return render_template('auth/register.html', form=form, recaptchakey=recaptchakey)

@bp.route('/confirm_acct/<token>', methods=['GET', 'POST'])
def confirm_acct(token):
    if current_user.is_authenticated:
        return redirect(url_for('auth.homepage'))
    user = User.verify_email_token(token)
    if not user:
        # incorporate redirect to error page instead of homepage later
        return redirect(url_for('auth.homepage'))
    user.verify_acct()
    db.session.commit()
    return render_template('auth/confirmed_acct.html', user=user)

@bp.route('/confirm_acct_request', methods=['GET', 'POST'])
def confirm_acct_request():
    if current_user.is_authenticated:
        redirect(url_for('auth.homepage'))
    form = PasswordResetRequestForm()
    if form.validate_on_submit():
        lowercased_email = (form.email.data).lower()
        user = User.query.filter_by(email=lowercased_email).first()
        if user:
            flash('A new confirmation link has been sent to your email.')
            send_confirmation_email(user)
            return redirect(url_for('auth.confirm_acct_request'))
        else:
            flash('A new confirmation link has been sent to your email.')
            return redirect(url_for('auth.confirm_acct_request'))
    return render_template('auth/confirm_acct_request.html', form=form)

@bp.route('/reset_password_request', methods=['GET', 'POST'])
def reset_password_request():
    if current_user.is_authenticated:
        return redirect(url_for('auth.homepage'))
    form = PasswordResetRequestForm()
    if form.validate_on_submit():
        lowercased_email = (form.email.data).lower()
        user = User.query.filter_by(email=lowercased_email).first()
        if user:
            flash('A new password link will be sent to your email.')
            send_password_reset_email(user)
            return redirect(url_for('auth.reset_password_request'))
        else:
            flash('A new password link will be sent to your email.')
            return redirect(url_for('auth.reset_password_request'))
    return render_template('auth/reset_password_request.html', form=form)

@bp.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if current_user.is_authenticated:
        return redirect(url_for('auth.homepage'))
    user = User.verify_email_token(token)
    if not user:
        # incorporate redirect to error page instead of homepage later
        return redirect(url_for('auth.homepage'))
    form = PasswordResetForm()
    if form.validate_on_submit():
        user.create_password(form.password.data)
        user.max_failed_login = 0
        db.session.commit()
        flash('Your password has successfully been resetted.')
        return redirect(url_for('auth.reset_password', token=token))
    return render_template('auth/reset_password.html', form=form)

    