from flask import render_template, redirect, url_for, request, flash, g, current_app, jsonify, Response, send_from_directory, session
from flask_login import current_user, login_required
from flask_babel import get_locale, _
from datetime import datetime, timedelta
from urllib.parse import urlparse
from math import sqrt
from hashlib import md5
from app import db
from app.models import User, Messages, Projects, PhotoGallery, Notifications, project_visitors
from app.main import bp
from app.main.forms import EditProfileForm, MessageForm, SearchForm
from app.project.forms import ProjectForm
from sqlalchemy import and_, or_
from werkzeug.datastructures import MultiDict
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
import os, json
import time

@bp.before_app_request
def before_request():
    if current_user.is_authenticated:
        current_user.last_seen = datetime.utcnow()
        db.session.commit()
    g.search_form = SearchForm()
    g.locale = str(get_locale())


@bp.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    user = User.query.filter_by(username=username).first()
    if user:
        project_list = user.all_projects.group_by(Projects.title).order_by(
                Projects.last_edit.desc()).all()
        return render_template('profile.html', user=user, projects=project_list)
    return redirect(url_for('auth.homepage'))

@bp.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm(original_email=current_user.email)
    form.username.data = current_user.username
    if form.validate_on_submit():
        print(form.picture.data)
        current_user.firstname = form.firstname.data
        current_user.lastname = form.lastname.data
        current_user.email = form.email.data
        current_user.bio = form.bio.data
        
        if len(form.password.data) >= 5:
            current_user.create_password(form.password.data)
        if form.picture.data:
            # CHECKS IF LINK IS REAL
            check_link = urlparse(form.picture.data)
            if check_link.scheme and check_link.netloc:
                current_user.picture = form.picture.data
        if form.randomavatar.data == True:
            # IF USER LEAVES PIC FORM EMPTY, PROVIDE GRAVATAR GENERATED IMG
            digest = md5(current_user.email.lower().encode('utf-8')).hexdigest()
            current_user.picture = 'https://www.gravatar.com/avatar/{}?d=identicon&s={}'.format(digest, 70)
        elif form.picture.data == '':
            current_user.picture = ''

        db.session.commit()
        flash('You new account changes have been updated!')
        return redirect(url_for('main.edit_profile'))
    elif request.method == 'GET':
        form.firstname.data = current_user.firstname
        form.lastname.data = current_user.lastname
        form.email.data = current_user.email
        form.bio.data = current_user.bio
        form.picture.data = current_user.picture
    return render_template('profile-edit.html', form=form)

@bp.route('/project_preview/<project_id>')
def project_preview(project_id):
    project = Projects.query.filter_by(id=project_id).first()
    if project:
        # ADD INTERACTIVE PHOTO LATER TO PROJECT_DETAILS
        project_details = {'description': project.description, 'difficulty': project.difficulty, 'cost': project.cost, 'duration': project.duration}
    return jsonify(project_details)

@bp.route('/privacy')
def privacy():
    if current_user.is_authenticated:
        return render_template('privacy.html')
    return redirect(url_for('auth.homepage'))


@bp.route('/follow/<username>')
@login_required
def follow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('Error: User not found!')
        return redirect(url_for('auth.homepage'))
    if user == current_user:
        flash('You cannot follow yourself!')
        return redirect(url_for('main.profile', username=username))
    
    current_user.follow(user)
    db.session.commit()
    flash('You are now following {}'.format(username))
    return redirect(url_for('main.profile', username=username))

@bp.route('/unfollow/<username>')
@login_required
def unfollow(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        flash('Error: User not found!')
        return redirect(url_for('auth.homepage'))
    if user == current_user:
        flash('You cannot unfollow yourself!')
        return redirect(url_for('main.profile', username=username))
    
    current_user.unfollow(user)
    db.session.commit()
    flash('You have unfollowed {}'.format(username))
    return redirect(url_for('main.profile', username=username))


@bp.route('/message_inbox')
@login_required
def message_inbox():
    page = request.args.get('page', 1, type=int)
    messages = current_user.message_received.group_by(Messages.subject).order_by(
                Messages.timestamp.desc()).paginate(
                    page, current_app.config['MESSAGES_PER_PAGE'], False)
    next_url = url_for('main.message_inbox_list', page=messages.next_num) if messages.has_next else None
    prev_url = url_for('main.message_inbox_list', page=messages.prev_num) if messages.has_prev else None

    form = MessageForm()

    return render_template('message-center.html', form=form, messages=messages.items,
                            next_url=next_url, prev_url=prev_url)

@bp.route('/view_message/<sender_username>/<msg_id>', methods=['GET', 'POST'])
@login_required
def view_message(sender_username, msg_id):
    msg_sender = User.query.filter_by(username=sender_username).first()
    msg_from_id = Messages.query.filter_by(id=msg_id).first()
    msg_sender_id = msg_sender.id
    msg_subj = msg_from_id.subject
    
    all_msg_received = Messages.query.filter(Messages.subject==msg_subj, Messages.sender_id==msg_sender_id, Messages.recipient_id==current_user.id)
    all_msg_sent = Messages.query.filter(Messages.subject==msg_subj, Messages.sender_id==current_user.id, Messages.recipient_id==msg_sender_id)
    all_msgs = all_msg_received.union(all_msg_sent).order_by(Messages.timestamp.desc()).all()
    
    if all_msgs:
        other_user = User.query.get(int(msg_sender_id))
        other_user_avatar = other_user.avatar(50)
        form = MessageForm()
        page = request.args.get('page', 1, type=int)

        # 'messages' IS TO POPULATE THE MESSAGE LIST UPON RENDERING NEW PAGE
        messages = current_user.message_received.group_by(Messages.subject).order_by(
                Messages.timestamp.desc()).paginate(
                    page, current_app.config['MESSAGES_PER_PAGE'], False)
        next_url = url_for('main.message_inbox_list', page=messages.next_num) if messages.has_next else None
        prev_url = url_for('main.message_inbox_list', page=messages.prev_num) if messages.has_prev else None
        
        # THIS MARKS THE MESSAGES AS READ WHEN CLICKED ON
        unmarked_msgs = all_msg_received.all()
        for unmarked_msg in unmarked_msgs:
            if unmarked_msg.message_read != True:
                unmarked_msg.message_read = True
                db.session.commit()

        # UPDATES NOTIFICATIONS
        read_msgs = Notifications.query \
                                .filter_by(user_id=current_user.id) \
                                .filter((Notifications.notification_type == 'message') | (Notifications.notification_type == 'message reply')) \
                                .filter(Notifications.title == msg_subj) \
                                .delete()
        if read_msgs:
            db.session.commit()

        msgs_json = []
        for each_subj_msg in all_msgs:
            msgs_json.append({'username': each_subj_msg.author.username, 'other_avatar': other_user_avatar, 'body': each_subj_msg.body, 'time': each_subj_msg.timestamp})
        
        return jsonify(msgs_json)
    return redirect(url_for('main.message_inbox'))

# THIS MAY REQUIRE THREADING TO WORK CONCURRENTING INSTEAD OF RENDERING THE LIST BY ITSELF
@bp.route('/message_inbox_list')
@login_required
def message_inbox_list():
    page = request.args.get('page', 1, type=int)
    messages = current_user.message_received.order_by(
                Messages.timestamp.desc()).paginate(
                    page, current_app.config['MESSAGES_PER_PAGE'], False)
    next_url = url_for('main.message_inbox_list', page=messages.next_num) if messages.has_next else None
    prev_url = url_for('main.message_inbox_list', page=messages.prev_num) if messages.has_prev else None
    return render_template('_message-list.html', messages=messages.items, next_url=next_url, prev_url=prev_url)

@bp.route('/send_message', methods=['GET', 'POST'])
@login_required
def send_message():
    data = MultiDict(mapping=request.json)
    form = MessageForm(data)
    if form.validate():
        user = User.query.filter_by(username=form.recipient.data).first()
        if current_user != user:
            msg = Messages(author=current_user, recipient=user, subject=form.subject.data,
                            body=form.body.data)
            db.session.add(msg)
            notification = Notifications(notification_type='message',
                                        username=current_user.username,
                                        title=form.subject.data,
                                        data=form.body.data,
                                        user=user)
            db.session.add(notification)
            db.session.commit()
            return "Message successfully sent!"

    #ERROR MSG TO USERS
    if form.recipient.errors:
        for error in form.recipient.errors:
            return error
    if form.subject.errors:
        for error in form.subject.errors:
            return error
    if form.body.errors:
        for error in form.body.errors:
            return error
    return redirect(url_for('main.message_inbox'))

@bp.route('/reply_message/<subject>/<recip_name>', methods=['POST'])
@login_required
def reply_message(subject, recip_name):
    reply_msg = request.json
    user = User.query.filter_by(username=recip_name).first()
    if user and (current_user != user):
        msg = Messages(author=current_user, recipient=user, subject=subject,
                        body=reply_msg)
        db.session.add(msg)

        notification = Notifications(notification_type='message reply',
                                    username=current_user.username,
                                    title=subject,
                                    data=reply_msg,
                                    user=user)
        db.session.add(notification)
        db.session.commit()

        #Need to implement websocket in the future...
        return 'Message successfully sent!'
    
    return redirect(url_for('main.message_inbox'))


@bp.route('/explore')
def explore():
    # MOST POPULAR PROJECTS QUERY/DATA
    all_likes = []
    all_projects = Projects.query.all()
    for eachproject in all_projects:
        all_likes.append(eachproject.likes)

    # 'MOST POPULAR PROJECT' ALGORITHM
    popular_likes = round(sum(all_likes) / len(all_likes))
    popular_last_edit = datetime.utcnow() - timedelta(days=14)
    popular_last_visit = datetime.utcnow() - timedelta(days=7)
    most_popular_projects = Projects.query \
                                    .join(project_visitors) \
                                    .join(User) \
                                        .filter(Projects.likes >= popular_likes) \
                                        .filter(Projects.last_edit > popular_last_edit) \
                                        .filter(Projects.private != 1) \
                                        .order_by(Projects.last_edit.desc()) \
                                        .filter(project_visitors.c.last_visit_date > popular_last_visit) \
                                        .limit(10)
    # 'TRENDING PROJECT' ALGORITHM
    trending_project_date = datetime.utcnow() - timedelta(days=7)
    trending_visit_date = datetime.utcnow() - timedelta(days=3)
    trending_projects = Projects.query \
                            .join(project_visitors) \
                            .join(User) \
                                .filter(Projects.created_date > trending_project_date) \
                                .filter(and_(Projects.likes > 1, Projects.likes < 10)) \
                                .filter(Projects.private != 1) \
                                .order_by(Projects.created_date.desc()) \
                                .filter(project_visitors.c.last_visit_date > trending_visit_date) \
                                .limit(10)
    # 'NEW PROJECT' ALGORITHM
    new_project_date = datetime.utcnow() - timedelta(days=3)
    new_projects = Projects.query \
                            .filter(Projects.created_date > new_project_date) \
                            .filter(Projects.private != 1) \
                            .order_by(Projects.created_date.desc()) \
                            .limit(10)

    return render_template('explore.html', most_popular_projects=most_popular_projects,
                                            trending_projects=trending_projects,
                                            new_projects=new_projects)

@bp.route('/about')
def about():
    return render_template('about.html')


@bp.route('/get_notifications')
@login_required
def get_notifications():
    all_new_notifications = Notifications.query \
                                    .filter_by(user_id=current_user.id) \
                                    .order_by(Notifications.timestamp.asc()) \
                                    .all()
    
    # IF ZERO NOTIFICATIONS INITIALLY OR EXISTING ONES REMOVED
    if len(all_new_notifications) == 0:
        return jsonify(0)

    # FOR INITIAL AND NEWER NOTIFICATIONS
    compiled_data = []
    for notification in all_new_notifications:
        data = {'Type': notification.notification_type,
                'User': notification.username,
                'Title': notification.title,
                'Data': notification.data,
                'Timestamp': notification.timestamp
                }
        compiled_data.append(data)
    return jsonify(compiled_data)

@bp.route('/delete_notifications')
@login_required
def delete_notifications():
    all_notifications = Notifications.query \
                                    .filter_by(user_id=current_user.id) \
                                    .delete()
    db.session.commit()
    return jsonify('Notifications cleared')

@bp.route('/search')
def search():
    if not g.search_form.validate():
        return redirect(url_for('auth.homepage'))
    page = request.args.get('page', 1, type=int)
    projects, total = Projects.search(g.search_form.q.data,
                                        page,
                                        current_app.config['PROJECTS_PER_PAGE'])
    next_url = url_for('main.search', q=g.search_form.q.data, page=page + 1) \
        if total > page * current_app.config['PROJECTS_PER_PAGE'] else None
    prev_url = url_for('main.search', q=g.search_form.q.data, page=page - 1) \
        if page > 1 else None
    
    return render_template('search.html', projects=projects.all(),
                                        next_url=next_url,
                                        prev_url=prev_url)
    


def allowed_file(filename):
    return '.' in filename and \
            filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']